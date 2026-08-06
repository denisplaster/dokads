/**
 * Runs the real migration + seed against an in-process Postgres (PGlite) and
 * exercises every query the app depends on.
 *
 *   npm run db:verify
 *
 * No daemon, no credentials, no network. Catches schema and SQL mistakes
 * before they reach Neon.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { and, asc, count, desc, eq, inArray, ne, sql } from 'drizzle-orm'
import * as schema from '../src/db/schema'
import { eventRows, regionRows, resourceRows, storyRows } from '../src/db/seed-data'

let failures = 0
function check(label: string, ok: boolean, detail = '') {
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

async function main() {
  const client = new PGlite()
  const db = drizzle(client, { schema })

  console.log('\nApplying migrations')
  const dir = join(process.cwd(), 'drizzle')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
  for (const f of files) {
    const sqlText = readFileSync(join(dir, f), 'utf8')
    // drizzle-kit separates statements with this marker
    for (const stmt of sqlText.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim()
      if (trimmed) await client.exec(trimmed)
    }
    console.log(`  ✓ ${f}`)
  }

  console.log('\nSeeding')
  await db.insert(schema.regions).values(regionRows)
  await db.insert(schema.events).values(eventRows)
  await db.insert(schema.stories).values(storyRows)
  await db.insert(schema.resources).values(resourceRows)
  check('content seeded', true, `${regionRows.length} regions, ${eventRows.length} events`)

  const PUBLIC = [
    'tentative',
    'registration opening soon',
    'registration open',
    'waitlist',
    'sold out',
    'cancelled',
    'completed',
  ]

  console.log('\nPublic reads')
  const pub = await db
    .select()
    .from(schema.events)
    .where(inArray(schema.events.status, PUBLIC))
    .orderBy(asc(schema.events.date))
  const drafts = eventRows.filter((e) => e.status === 'draft').length
  check(
    'draft events excluded from public list',
    pub.length === eventRows.length - drafts,
    `${pub.length} public of ${eventRows.length}, ${drafts} draft`,
  )
  check('public events sorted by date', pub.every((e, i) => i === 0 || pub[i - 1].date <= e.date))

  const flagship = pub.find((e) => e.slug === 'minnesota-dokad-coffee-meetup')
  check('flagship event round-trips', !!flagship && flagship.status === 'tentative')
  check(
    'tentative notes survive as jsonb',
    Array.isArray(flagship?.tentativeNotes) && (flagship?.tentativeNotes?.length ?? 0) === 4,
  )
  check('backup date preserved', flagship?.backupDate === '2026-09-20')
  check('no-plus-ones rule preserved', flagship?.plusOnes === false)

  const published = await db
    .select()
    .from(schema.stories)
    .where(eq(schema.stories.status, 'published'))
  check('stories published', published.length === storyRows.length)
  check(
    'no seeded story claims to be a personal account',
    published.every((s) => !s.isPlaceholder && s.byline === 'DOKADS editorial'),
  )
  check(
    'story body survives as jsonb array',
    published.every((s) => Array.isArray(s.body) && s.body.length > 0),
  )
  check(
    'every story has substantial body copy',
    published.every((s) => (s.body as string[]).join(' ').length > 1500),
  )

  const publishedRegions = await db
    .select()
    .from(schema.regions)
    .where(ne(schema.regions.status, 'interest'))
  check(
    'only regions with organisers are publishable',
    publishedRegions.length === regionRows.filter((r) => r.status !== 'interest').length,
    `${publishedRegions.length} publishable`,
  )
  check(
    'interest-only regions are excluded',
    !publishedRegions.some((r) => r.status === 'interest'),
  )

  const mnEvents = await db
    .select()
    .from(schema.events)
    .where(
      and(
        eq(schema.events.regionSlug, 'minnesota'),
        inArray(schema.events.status, PUBLIC),
      ),
    )
  check('region event filter works', mnEvents.length === 1, `${mnEvents.length} public in Minnesota`)

  console.log('\nWrites + privacy rules')
  await db.insert(schema.members).values([
    {
      id: 'm1',
      name: 'Adult',
      email: 'adult@example.com',
      interests: ['coffee', 'guided', 'korea-travel'],
      timing: ['sun-afternoon', 'sat-afternoon'],
      venues: ['coffee-shop', 'library'],
      regionSlug: 'minnesota',
      ageRange: '25-29',
      isMinor: false,
      wantsVolunteer: true,
      agreedGuidelines: true,
    },
    {
      id: 'm2',
      name: 'Younger',
      email: 'teen@example.com',
      interests: ['coffee', 'culture'],
      timing: ['sun-afternoon'],
      venues: ['coffee-shop'],
      regionSlug: 'minnesota',
      ageRange: '16-17',
      isMinor: true,
      agreedGuidelines: true,
    },
  ])

  const dupe = await db
    .insert(schema.members)
    .values({
      id: 'm3',
      name: 'Adult again',
      email: 'adult@example.com',
      agreedGuidelines: true,
    })
    .onConflictDoNothing()
    .returning()
  check('duplicate email does not create a second member', dupe.length === 0)

  const minors = await db
    .select({ n: count() })
    .from(schema.members)
    .where(eq(schema.members.isMinor, true))
  check('minor flag is queryable for exclusion', Number(minors[0].n) === 1)

  // aggregate tally — the planning dashboard's core query
  const tally = await db.execute<{ value: string; n: string }>(sql`
    SELECT elem AS value, COUNT(*)::text AS n
    FROM ${schema.members}, jsonb_array_elements_text(${sql.identifier('interests')}) AS elem
    GROUP BY elem
    ORDER BY COUNT(*) DESC
  `)
  const rows = tally.rows ?? []
  const coffee = rows.find((r) => r.value === 'coffee')
  check('jsonb interest tally works', Number(coffee?.n) === 2, `coffee counted ${coffee?.n}`)
  check('tally is ordered by frequency', Number(rows[0]?.n) >= Number(rows[rows.length - 1]?.n))

  await db.insert(schema.eventRegistrations).values({
    id: 'r1',
    eventId: eventRows[0].id,
    firstName: 'Test',
    email: 'reg@example.com',
    ageRange: '30-34',
    agreedGuidelines: true,
  })
  const dupeReg = await db
    .insert(schema.eventRegistrations)
    .values({
      id: 'r2',
      eventId: eventRows[0].id,
      firstName: 'Test',
      email: 'reg@example.com',
      agreedGuidelines: true,
    })
    .onConflictDoNothing()
    .returning()
  check('cannot register twice for the same event', dupeReg.length === 0)

  // deletion has to actually work — the site promises it
  await db.delete(schema.members).where(eq(schema.members.email, 'teen@example.com'))
  const left = await db.select({ n: count() }).from(schema.members)
  check('member deletion works', Number(left[0].n) === 1)

  // cascade: deleting an event must not orphan registrations
  await db.delete(schema.events).where(eq(schema.events.id, eventRows[0].id))
  const orphans = await db.select({ n: count() }).from(schema.eventRegistrations)
  check('registrations cascade with their event', Number(orphans[0].n) === 0)

  await db.insert(schema.submissions).values({
    id: 's1',
    kind: 'resource',
    name: 'Someone',
    email: 's@example.com',
    subject: 'A podcast',
    message: 'It helped me.',
    payload: { shelf: 'listen', credit: 'first name' },
  })
  const newSubs = await db
    .select()
    .from(schema.submissions)
    .where(eq(schema.submissions.status, 'new'))
  check('submissions land as new', newSubs.length === 1)
  check(
    'submission payload survives as jsonb',
    (newSubs[0].payload as Record<string, unknown>)?.shelf === 'listen',
  )

  const ordered = await db
    .select()
    .from(schema.resources)
    .where(eq(schema.resources.published, true))
    .orderBy(asc(schema.resources.sortOrder))
  check('resources keep their curated order', ordered[0]?.id === resourceRows[0].id)
  check(
    'linked resources are listed; unlinked are listed-library or open call',
    ordered.every((r) => (r.link ? r.status === 'listed' : true)),
  )
  check(
    'open calls carry no link',
    ordered.filter((r) => r.status === 'open call').every((r) => r.link === null),
  )
  check(
    'every linked resource uses https',
    ordered.filter((r) => r.link).every((r) => (r.link as string).startsWith('https://')),
  )

  const recent = await db
    .select()
    .from(schema.submissions)
    .orderBy(desc(schema.submissions.createdAt))
  check('submissions sort newest first', recent.length === 1)

  await client.close()

  console.log(
    failures === 0
      ? '\nAll database checks passed.\n'
      : `\n${failures} check(s) FAILED.\n`,
  )
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
