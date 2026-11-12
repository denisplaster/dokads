/**
 * Builds the content snapshot, from the files or from the database, and
 * performs the one-time import of the files into a database.
 *
 * Used by scripts/snapshot.ts (every build) and by the test suites. Never
 * imported by a public page.
 */
import { asc, eq, inArray, notInArray } from 'drizzle-orm'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from '@/db/schema'
import { eventRows, regionRows, resourceRows, storyRows } from '@/db/seed-data'
import { events as fileEvents, STATUS_META } from '@/data/events'
import type { EventStatus } from '@/data/events'
import { stories as fileStories } from '@/data/stories'
import { regions as fileRegions } from '@/data/regions'
import { resources as fileResources } from '@/data/resources'
import { toEvent, toRegion, toResource, toStory } from '@/lib/adapt'
import type { ContentSnapshot } from './snapshot-types'

export type Db = NeonHttpDatabase<typeof schema>

const PUBLIC_STATUSES = (Object.keys(STATUS_META) as EventStatus[]).filter(
  (s) => STATUS_META[s].public,
)

export function snapshotFromFiles(): ContentSnapshot {
  return {
    source: 'files',
    takenAt: null,
    events: fileEvents
      .filter((e) => STATUS_META[e.status].public)
      .sort((a, b) => a.date.localeCompare(b.date)),
    stories: fileStories,
    regions: fileRegions,
    resources: fileResources,
    copy: {},
  }
}

export async function snapshotFromDb(db: Db): Promise<ContentSnapshot> {
  const takenAt = new Date().toISOString()
  const [ev, st, rg, rs, cp] = await Promise.all([
    db
      .select()
      .from(schema.events)
      .where(inArray(schema.events.status, PUBLIC_STATUSES))
      .orderBy(asc(schema.events.date), asc(schema.events.title)),
    db
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.status, 'published'))
      .orderBy(asc(schema.stories.sortOrder), asc(schema.stories.createdAt), asc(schema.stories.slug)),
    db
      .select()
      .from(schema.regions)
      .orderBy(asc(schema.regions.sortOrder), asc(schema.regions.name)),
    db
      .select()
      .from(schema.resources)
      .where(eq(schema.resources.published, true))
      .orderBy(asc(schema.resources.sortOrder), asc(schema.resources.title)),
    db.select().from(schema.pageCopy),
  ])

  const copy: ContentSnapshot['copy'] = {}
  for (const row of cp) (copy[row.page] ??= {})[row.key] = row.value

  return {
    source: 'database',
    takenAt,
    events: ev.map(toEvent),
    stories: st.map(toStory),
    regions: rg.map(toRegion),
    resources: rs.map(toResource),
    copy,
  }
}

/* ==========================================================================
   ONE-TIME IMPORT
   ========================================================================== */

export const IMPORT_KEY = 'content_import'

export type ImportReport = {
  at: string
  events: number
  stories: number
  regions: number
  resources: number
  /** older database rows that are not part of the site, now hidden */
  hidden: { kind: string; key: string; title: string }[]
}

/**
 * Makes the database match the content the static site was showing, once.
 *
 * Before cms mode the public site was built from src/data, so that is the
 * approved, live content — the database may hold older copies from an
 * earlier admin. Every record in the files is written over its database
 * twin. Database rows that are not in the files are HIDDEN (draft /
 * unpublished / gathering interest), never deleted, so nothing an editor
 * once wrote is lost.
 *
 * Runs only while site_meta has no import record; after that the database is
 * the source of truth and the files are never read into it again. Touches
 * content tables only — never people, accounts, or page text.
 */
export async function importFilesIfNeeded(db: Db): Promise<ImportReport | null> {
  const [done] = await db
    .select()
    .from(schema.siteMeta)
    .where(eq(schema.siteMeta.key, IMPORT_KEY))
    .limit(1)
  if (done) return null

  const now = new Date()
  const hidden: ImportReport['hidden'] = []

  for (const row of regionRows) {
    await db
      .insert(schema.regions)
      .values(row)
      .onConflictDoUpdate({ target: schema.regions.slug, set: { ...row, updatedAt: now } })
  }
  for (const row of eventRows) {
    // slug is the public identity, and an older row may hold it under another
    // id. Update that row in place — deleting it would cascade into its
    // registrations, which are personal data.
    const [bySlug] = await db
      .select({ id: schema.events.id })
      .from(schema.events)
      .where(eq(schema.events.slug, row.slug))
      .limit(1)
    if (bySlug) {
      await db
        .update(schema.events)
        .set({ ...row, id: bySlug.id, updatedAt: now })
        .where(eq(schema.events.id, bySlug.id))
    } else {
      await db
        .insert(schema.events)
        .values(row)
        .onConflictDoUpdate({ target: schema.events.id, set: { ...row, updatedAt: now } })
    }
  }
  for (const row of storyRows) {
    const full = { ...row, publishedAt: now }
    await db
      .insert(schema.stories)
      .values(full)
      .onConflictDoUpdate({ target: schema.stories.slug, set: { ...full, updatedAt: now } })
  }
  for (const row of resourceRows) {
    await db
      .insert(schema.resources)
      .values(row)
      .onConflictDoUpdate({ target: schema.resources.id, set: { ...row, updatedAt: now } })
  }

  // hide what the live site was not showing
  const extraEvents = await db
    .select()
    .from(schema.events)
    .where(notInArray(schema.events.slug, eventRows.map((r) => r.slug)))
  for (const e of extraEvents) {
    if (e.status === 'draft') continue
    await db.update(schema.events).set({ status: 'draft', updatedAt: now }).where(eq(schema.events.id, e.id))
    hidden.push({ kind: 'event', key: e.slug, title: e.title })
  }
  const extraStories = await db
    .select()
    .from(schema.stories)
    .where(notInArray(schema.stories.slug, storyRows.map((r) => r.slug)))
  for (const s of extraStories) {
    if (s.status === 'draft') continue
    await db.update(schema.stories).set({ status: 'draft', updatedAt: now }).where(eq(schema.stories.slug, s.slug))
    hidden.push({ kind: 'story', key: s.slug, title: s.title })
  }
  const extraResources = await db
    .select()
    .from(schema.resources)
    .where(notInArray(schema.resources.id, resourceRows.map((r) => r.id!)))
  for (const r of extraResources) {
    if (!r.published) continue
    await db.update(schema.resources).set({ published: false, updatedAt: now }).where(eq(schema.resources.id, r.id))
    hidden.push({ kind: 'resource', key: r.id, title: r.title })
  }
  const extraRegions = await db
    .select()
    .from(schema.regions)
    .where(notInArray(schema.regions.slug, regionRows.map((r) => r.slug)))
  for (const r of extraRegions) {
    if (r.status === 'interest') continue
    await db.update(schema.regions).set({ status: 'interest', updatedAt: now }).where(eq(schema.regions.slug, r.slug))
    hidden.push({ kind: 'region', key: r.slug, title: r.name })
  }

  const report: ImportReport = {
    at: now.toISOString(),
    events: eventRows.length,
    stories: storyRows.length,
    regions: regionRows.length,
    resources: resourceRows.length,
    hidden,
  }
  await db.insert(schema.siteMeta).values({ key: IMPORT_KEY, value: report })
  return report
}
