/**
 * Applies migrations (local only) and seeds content from the original
 * hand-authored modules.
 *
 *   npm run db:seed
 *
 * Safe to re-run: existing rows are LEFT ALONE, so seeding again never reverts
 * something edited in the admin. Pass --force to overwrite existing rows with
 * the file contents instead — that discards admin edits, so it is opt-in.
 *
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
import { describeDatabaseUrl, requireDatabaseUrl } from './db-url'

const FORCE = process.argv.includes('--force')
/** Force-refresh ONLY editorial content (stories + resources), never events
 * or regions — so a content update cannot revert an event status set in the
 * admin. This is the flag to use when shipping new site copy. */
const REFRESH_EDITORIAL = process.argv.includes('--refresh-editorial')

/**
 * Old placeholder layout copy, retired in favour of real editorial content.
 * Hidden (status -> draft), not deleted — and only while still flagged as
 * placeholder, so a piece an admin rewrote into something real is never
 * touched.
 */
const RETIRED_STORY_SLUGS = [
  'the-questions-i-inherited',
  'two-generations-one-kitchen-table',
  'things-my-halmoni-would-have-said',
  'the-airport-photo',
  'do-you-call-it-going-back',
  'a-recording-of-my-dad-explaining',
  'the-word-for-cousin',
]

/** The old abstract "shelf" cards, replaced by real recommendations. */
const RETIRED_RESOURCE_IDS = ['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12']

type AnyDb = {
  insert: (t: unknown) => {
    values: (v: unknown) => {
      onConflictDoUpdate: (c: unknown) => Promise<unknown>
      onConflictDoNothing: (c?: unknown) => Promise<unknown>
    }
  }
}

/** Insert; clobber an existing row only when forced for this table. */
async function upsert(db: AnyDb, table: unknown, row: object, target: unknown, force: boolean) {
  const q = db.insert(table).values(row)
  return force
    ? q.onConflictDoUpdate({ target, set: { ...row, updatedAt: new Date() } })
    : q.onConflictDoNothing({ target })
}

async function connect() {
  const url = requireDatabaseUrl()
  console.log(`Target database: ${describeDatabaseUrl(url)}\n`)

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

  const forceEditorial = FORCE || REFRESH_EDITORIAL

  // regions first — events reference a region slug
  for (const row of regionRows) {
    await upsert(db, schema.regions, row, schema.regions.slug, FORCE)
  }
  console.log(`✓ ${regionRows.length} regions`)

  for (const row of eventRows) {
    await upsert(db, schema.events, row, schema.events.slug, FORCE)
  }
  console.log(`✓ ${eventRows.length} events`)

  for (const row of storyRows) {
    await upsert(db, schema.stories, row, schema.stories.slug, forceEditorial)
  }
  console.log(`✓ ${storyRows.length} stories (editorial, written for real)`)

  for (const row of resourceRows) {
    await upsert(db, schema.resources, row, schema.resources.id, forceEditorial)
  }
  const linked = resourceRows.filter((r) => r.link).length
  console.log(`✓ ${resourceRows.length} resources (${linked} linked, rest library/open-call)`)

  // Retire old placeholder content: hide, never delete, and never touch a row
  // an admin has since turned into something real.
  const { inArray, and, eq, isNull } = await import('drizzle-orm')
  const raw = db as unknown as {
    update: (t: unknown) => { set: (v: object) => { where: (w: unknown) => Promise<unknown> } }
  }
  await raw
    .update(schema.stories)
    .set({ status: 'draft', updatedAt: new Date() })
    .where(
      and(
        inArray(schema.stories.slug, RETIRED_STORY_SLUGS),
        eq(schema.stories.isPlaceholder, true),
      ),
    )
  console.log(`✓ retired ${RETIRED_STORY_SLUGS.length} placeholder stories (hidden, not deleted)`)

  await raw
    .update(schema.resources)
    .set({ published: false, updatedAt: new Date() })
    .where(
      and(
        inArray(schema.resources.id, RETIRED_RESOURCE_IDS),
        isNull(schema.resources.link),
      ),
    )
  console.log(`✓ retired ${RETIRED_RESOURCE_IDS.length} placeholder resource shelves`)

  console.log(
    `\nSeed complete${local ? ' (local pglite database)' : ''}. ` +
      'Content tables only — no personal data was touched.',
  )
  console.log(
    FORCE
      ? 'Ran with --force: ALL existing rows were overwritten with the file contents.'
      : REFRESH_EDITORIAL
        ? 'Ran with --refresh-editorial: stories and resources were updated; events and regions untouched.'
        : 'Existing rows were left untouched. Use --refresh-editorial to ship content updates.',
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
