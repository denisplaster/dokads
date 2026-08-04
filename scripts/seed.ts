/**
 * Seeds content from the original hand-authored modules.
 *
 *   npm run db:seed
 *
 * Idempotent: re-running updates existing rows rather than duplicating them.
 * Only touches content tables — never members, registrations, or submissions.
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/db/schema'
import { eventRows, regionRows, resourceRows, storyRows } from '../src/db/seed-data'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set — see .env.example')

  const db = drizzle(neon(url), { schema })

  // regions first: events reference a region slug
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

  console.log('\nSeed complete. Content tables only — no personal data was touched.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
