/**
 * Applies migrations (local only) and seeds content from the original
 * hand-authored modules.
 *
 *   npm run db:seed
 *
 * Idempotent: re-running updates existing rows rather than duplicating them.
 * Only touches content tables — never members, registrations, or submissions.
 *
 * Against Neon, run `npm run db:migrate` first; drizzle-kit owns migrations
 * there. Against a local pglite:// URL this script applies them itself, so a
 * fresh clone is one command from a working site.
 */
import 'dotenv/config'
import { mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import * as schema from '../src/db/schema'
import { eventRows, regionRows, resourceRows, storyRows } from '../src/db/seed-data'

type AnyDb = {
  insert: (t: unknown) => {
    values: (v: unknown) => { onConflictDoUpdate: (c: unknown) => Promise<unknown> }
  }
}

async function connect() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set — see .env.example')

  if (url.startsWith('pglite://')) {
    const { PGlite } = await import('@electric-sql/pglite')
    const { drizzle } = await import('drizzle-orm/pglite')
    const path = url.replace('pglite://', '')
    mkdirSync(dirname(path), { recursive: true })
    const client = new PGlite(path)
    // local databases have no migration runner in front of them
    const dir = join(process.cwd(), 'drizzle')
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
      const text = readFileSync(join(dir, f), 'utf8')
      for (const stmt of text.split('--> statement-breakpoint')) {
        const t = stmt.trim()
        if (!t) continue
        try {
          await client.exec(t)
        } catch (err) {
          // re-seeding an existing local database is normal
          if (!String(err).includes('already exists')) throw err
        }
      }
    }
    console.log('✓ migrations applied (local)')
    return { db: drizzle(client, { schema }) as unknown as AnyDb, local: true }
  }

  const { neon } = await import('@neondatabase/serverless')
  const { drizzle } = await import('drizzle-orm/neon-http')
  return { db: drizzle(neon(url), { schema }) as unknown as AnyDb, local: false }
}

async function main() {
  const { db, local } = await connect()

  // regions first — events reference a region slug
  for (const row of regionRows) {
    await db
      .insert(schema.regions)
      .values(row)
      .onConflictDoUpdate({ target: schema.regions.slug, set: { ...row, updatedAt: new Date() } })
  }
  console.log(`✓ ${regionRows.length} regions`)

  for (const row of eventRows) {
    await db
      .insert(schema.events)
      .values(row)
      .onConflictDoUpdate({ target: schema.events.slug, set: { ...row, updatedAt: new Date() } })
  }
  console.log(`✓ ${eventRows.length} events`)

  for (const row of storyRows) {
    await db
      .insert(schema.stories)
      .values(row)
      .onConflictDoUpdate({ target: schema.stories.slug, set: { ...row, updatedAt: new Date() } })
  }
  console.log(`✓ ${storyRows.length} stories (all flagged as placeholder copy)`)

  for (const row of resourceRows) {
    await db
      .insert(schema.resources)
      .values(row)
      .onConflictDoUpdate({ target: schema.resources.id, set: { ...row, updatedAt: new Date() } })
  }
  console.log(`✓ ${resourceRows.length} resources (all 'open call')`)

  console.log(
    `\nSeed complete${local ? ' (local pglite database)' : ''}. ` +
      'Content tables only — no personal data was touched.',
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
