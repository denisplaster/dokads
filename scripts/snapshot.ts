/**
 * Writes src/generated/content.json — the only content the public site reads.
 *
 *   npm run snapshot            (also runs before every `dev` and `build`)
 *
 * static mode: built from the TypeScript modules in src/data. No database.
 *
 * cms / full mode: read from Postgres, once, here. This is the whole reason
 * public traffic costs nothing: visitors get pages prerendered from this file
 * and never trigger a query, so Neon can scale to zero between edits. The
 * database wakes for a build (this script) and for an editor using /admin —
 * nothing else.
 *
 * In cms / full mode this script also:
 *   - applies pending migrations, on production builds and local databases
 *     only (a preview build of an unmerged branch must not change the schema
 *     production runs on). Set MIGRATE_ON_BUILD=1 to force it.
 *   - imports the files into the database the first time it ever runs
 *     against that database (see importFilesIfNeeded) — so switching a live
 *     static site to cms mode keeps exactly the content it was showing.
 *
 * If the database cannot be read, the build fails. Vercel keeps serving the
 * previous deployment, which is the right outcome: a failed read must never
 * publish an empty site.
 */
import 'dotenv/config'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { siteMode } from '../src/lib/site-mode'
import {
  importFilesIfNeeded,
  snapshotFromDb,
  snapshotFromFiles,
} from '../src/content/build-snapshot'
import type { Db } from '../src/content/build-snapshot'
import type { ContentSnapshot } from '../src/content/snapshot-types'
import { describeDatabaseUrl, requireDatabaseUrl } from './db-url'

export const SNAPSHOT_PATH = 'src/generated/content.json'

/** Only the label edits — small enough to ship to the browser (see src/content/vocab.ts). */
const LABELS_PATH = 'src/generated/labels.json'

function write(snap: ContentSnapshot) {
  mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true })
  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snap, null, 2)}\n`)
  writeFileSync(LABELS_PATH, `${JSON.stringify({ overrides: snap.copy.labels ?? {} }, null, 2)}\n`)
}

function summary(snap: ContentSnapshot) {
  const copyFields = Object.values(snap.copy).reduce((n, p) => n + Object.keys(p).length, 0)
  return (
    `${snap.events.length} events, ${snap.stories.length} stories, ` +
    `${snap.regions.length} regions, ${snap.resources.length} resources, ` +
    `${copyFields} edited text fields`
  )
}

async function connect(url: string): Promise<{ db: Db; migrate: () => Promise<void>; close: () => Promise<void> }> {
  const schema = await import('../src/db/schema')
  if (url.startsWith('pglite://')) {
    const { PGlite } = await import('@electric-sql/pglite')
    const { drizzle } = await import('drizzle-orm/pglite')
    const { migrate } = await import('drizzle-orm/pglite/migrator')
    const path = url.replace('pglite://', '')
    mkdirSync(dirname(path), { recursive: true })
    const client = new PGlite(path)
    const db = drizzle(client, { schema })
    return {
      db: db as unknown as Db,
      migrate: () => migrate(db, { migrationsFolder: 'drizzle' }),
      close: () => client.close(),
    }
  }
  const { neon } = await import('@neondatabase/serverless')
  const { drizzle } = await import('drizzle-orm/neon-http')
  const { migrate } = await import('drizzle-orm/neon-http/migrator')
  const db = drizzle(neon(url), { schema })
  return { db, migrate: () => migrate(db, { migrationsFolder: 'drizzle' }), close: async () => {} }
}

async function main() {
  if (process.argv.includes('--if-missing') && existsSync(SNAPSHOT_PATH) && existsSync(LABELS_PATH)) {
    return
  }

  const mode = siteMode()
  if (mode === 'static') {
    const snap = snapshotFromFiles()
    write(snap)
    console.log(`content: from files (static mode) — ${summary(snap)}`)
    return
  }

  const url = requireDatabaseUrl()
  const local = url.startsWith('pglite://')
  console.log(`content: from database ${describeDatabaseUrl(url)} (${mode} mode)`)
  const { db, migrate, close } = await connect(url)

  const migrateNow =
    local || process.env.VERCEL_ENV === 'production' || process.env.MIGRATE_ON_BUILD === '1'
  if (migrateNow) {
    await migrate()
    console.log('content: migrations up to date')
  } else {
    console.log('content: migrations skipped (not a production build)')
  }

  const report = await importFilesIfNeeded(db)
  if (report) {
    console.log(
      `content: first run against this database — imported the site files ` +
        `(${report.events} events, ${report.stories} stories, ${report.regions} regions, ` +
        `${report.resources} resources)`,
    )
    for (const h of report.hidden) {
      console.log(`content:   hid older ${h.kind} not on the site: ${h.title} (${h.key})`)
    }
  }

  const snap = await snapshotFromDb(db)
  write(snap)
  console.log(`content: ${summary(snap)}`)

  // a count only — enough to tell "nobody can sign in" from the build log
  const schema = await import('../src/db/schema')
  const { count } = await import('drizzle-orm')
  const [{ n }] = await db.select({ n: count() }).from(schema.user)
  console.log(
    n
      ? `content: ${n} editor account${n === 1 ? '' : 's'} can sign in to /admin`
      : 'content: no editor accounts yet — run `npm run admin:link` (see README → Editors and access)',
  )
  await close()
}

main().catch((err) => {
  console.error('content: could not build the snapshot —', err)
  process.exit(1)
})
