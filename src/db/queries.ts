import 'server-only'
import { and, asc, count, desc, eq, inArray, ne, sql } from 'drizzle-orm'
import { db } from './index'
import { events, members, regions, resources, stories, submissions, eventRegistrations } from './schema'
import type { DbEvent, DbRegion, DbResource, DbStory } from './schema'

/* ==========================================================================
   PUBLIC READS
   Anything reachable without signing in. Drafts never leak out of here.
   ========================================================================== */

/** Draft events are visible to admins only. */
const PUBLIC_EVENT_STATUSES = [
  'tentative',
  'registration opening soon',
  'registration open',
  'waitlist',
  'sold out',
  'cancelled',
  'completed',
]

export async function getPublicEvents(): Promise<DbEvent[]> {
  return db
    .select()
    .from(events)
    .where(inArray(events.status, PUBLIC_EVENT_STATUSES))
    .orderBy(asc(events.date))
}

export async function getEventBySlug(slug: string): Promise<DbEvent | undefined> {
  const [row] = await db.select().from(events).where(eq(events.slug, slug)).limit(1)
  return row
}

export async function getEventsInRegion(regionSlug: string): Promise<DbEvent[]> {
  return db
    .select()
    .from(events)
    .where(
      and(eq(events.regionSlug, regionSlug), inArray(events.status, PUBLIC_EVENT_STATUSES)),
    )
    .orderBy(asc(events.date))
}

export async function getPublishedStories(): Promise<DbStory[]> {
  return db
    .select()
    .from(stories)
    .where(eq(stories.status, 'published'))
    .orderBy(desc(stories.featured), asc(stories.title))
}

export async function getStoryBySlug(slug: string): Promise<DbStory | undefined> {
  const [row] = await db
    .select()
    .from(stories)
    .where(and(eq(stories.slug, slug), eq(stories.status, 'published')))
    .limit(1)
  return row
}

export async function getRelatedStories(slug: string, limit = 3): Promise<DbStory[]> {
  const current = await getStoryBySlug(slug)
  const rows = await db
    .select()
    .from(stories)
    .where(and(eq(stories.status, 'published'), ne(stories.slug, slug)))
  // same format first, so a poem suggests a poem
  return rows
    .sort((a, b) => Number(b.kind === current?.kind) - Number(a.kind === current?.kind))
    .slice(0, limit)
}

export async function getPublishedResources(): Promise<DbResource[]> {
  return db
    .select()
    .from(resources)
    .where(eq(resources.published, true))
    .orderBy(asc(resources.sortOrder))
}

export async function getAllRegions(): Promise<DbRegion[]> {
  return db.select().from(regions).orderBy(asc(regions.sortOrder))
}

/** A region only gets a public page once real organisers exist. */
export async function getPublishedRegion(slug: string): Promise<DbRegion | undefined> {
  const [row] = await db
    .select()
    .from(regions)
    .where(and(eq(regions.slug, slug), ne(regions.status, 'interest')))
    .limit(1)
  return row
}

export async function getRegionEventCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ regionSlug: events.regionSlug, n: count() })
    .from(events)
    .where(inArray(events.status, PUBLIC_EVENT_STATUSES))
    .groupBy(events.regionSlug)
  return Object.fromEntries(rows.map((r) => [r.regionSlug, Number(r.n)]))
}

/* ==========================================================================
   ADMIN READS
   Callers must already have checked the session — see lib/auth-guard.ts.
   ========================================================================== */

export async function adminListEvents(): Promise<DbEvent[]> {
  return db.select().from(events).orderBy(asc(events.date))
}

export async function adminListStories(): Promise<DbStory[]> {
  return db.select().from(stories).orderBy(desc(stories.updatedAt))
}

export async function adminListResources(): Promise<DbResource[]> {
  return db.select().from(resources).orderBy(asc(resources.sortOrder))
}

export async function adminListMembers() {
  return db.select().from(members).orderBy(desc(members.createdAt))
}

export async function adminListSubmissions() {
  return db.select().from(submissions).orderBy(desc(submissions.createdAt))
}

export async function adminListRegistrations(eventId?: string) {
  const q = db
    .select({
      reg: eventRegistrations,
      eventTitle: events.title,
      eventSlug: events.slug,
    })
    .from(eventRegistrations)
    .innerJoin(events, eq(events.id, eventRegistrations.eventId))
    .orderBy(desc(eventRegistrations.createdAt))
  if (eventId) return q.where(eq(eventRegistrations.eventId, eventId))
  return q
}

/* ==========================================================================
   AGGREGATES
   The planning dashboard. Counts only — the whole point of asking about
   interests, timing and venues was to decide what to run, not to profile
   anyone, and the admin should make the anonymous view the easy one.
   ========================================================================== */

export type Tally = { value: string; n: number }

/** Count occurrences across a jsonb string-array column. */
async function tallyJsonArray(column: 'interests' | 'timing' | 'venues'): Promise<Tally[]> {
  const col = sql.identifier(column)
  const rows = await db.execute<{ value: string; n: string }>(sql`
    SELECT elem AS value, COUNT(*)::text AS n
    FROM ${members}, jsonb_array_elements_text(${col}) AS elem
    GROUP BY elem
    ORDER BY COUNT(*) DESC
  `)
  return (rows.rows ?? []).map((r) => ({ value: r.value, n: Number(r.n) }))
}

export async function getPlanningTallies() {
  const [interests, timing, venues, byRegion, byAge, totals] = await Promise.all([
    tallyJsonArray('interests'),
    tallyJsonArray('timing'),
    tallyJsonArray('venues'),
    db
      .select({ value: members.regionSlug, n: count() })
      .from(members)
      .groupBy(members.regionSlug)
      .orderBy(desc(count())),
    db
      .select({ value: members.ageRange, n: count() })
      .from(members)
      .groupBy(members.ageRange)
      .orderBy(desc(count())),
    db
      .select({
        all: count(),
        minors: sql<number>`COUNT(*) FILTER (WHERE ${members.isMinor})`,
        volunteers: sql<number>`COUNT(*) FILTER (WHERE ${members.wantsVolunteer})`,
      })
      .from(members),
  ])

  return {
    interests,
    timing,
    venues,
    byRegion: byRegion.map((r) => ({ value: r.value ?? 'Not said', n: Number(r.n) })),
    byAge: byAge.map((r) => ({ value: r.value ?? 'Not said', n: Number(r.n) })),
    totals: {
      members: Number(totals[0]?.all ?? 0),
      minors: Number(totals[0]?.minors ?? 0),
      volunteers: Number(totals[0]?.volunteers ?? 0),
    },
  }
}

export async function getAdminCounts() {
  const [m, s, r, e] = await Promise.all([
    db.select({ n: count() }).from(members),
    db.select({ n: count() }).from(submissions).where(eq(submissions.status, 'new')),
    db.select({ n: count() }).from(eventRegistrations),
    db.select({ n: count() }).from(events),
  ])
  return {
    members: Number(m[0]?.n ?? 0),
    newSubmissions: Number(s[0]?.n ?? 0),
    registrations: Number(r[0]?.n ?? 0),
    events: Number(e[0]?.n ?? 0),
  }
}
