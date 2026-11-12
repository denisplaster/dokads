/**
 * The public read layer.
 *
 * Reads only the build-time content snapshot (src/content/snapshot.ts), never
 * the database — so public pages prerender from a file, and no visitor can
 * cause a query. In static mode the snapshot is made from src/data; in cms and
 * full mode, from Postgres. Either way these functions are synchronous and
 * return the view types directly.
 *
 * The snapshot already excludes drafts; the filters below are kept anyway so
 * a draft can never become public through a malformed snapshot.
 */
import { STATUS_META } from '@/data/events'
import type { DokEvent } from '@/data/events'
import type { Story } from '@/data/stories'
import type { Region } from '@/data/regions'
import type { Resource } from '@/data/resources'
import { snapshot } from '@/content/snapshot'

const allEvents = snapshot.events
const stories = snapshot.stories
const regions = snapshot.regions
const resources = snapshot.resources

const getEvent = (slug: string) => allEvents.find((e) => e.slug === slug)
const getStory = (slug: string) => stories.find((s) => s.slug === slug)
const getRegion = (slug: string) => regions.find((r) => r.slug === slug)

function relatedStories(slug: string, count: number) {
  const current = getStory(slug)
  return stories
    .filter((s) => s.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.kind === current?.kind ? 0 : 1
      const bMatch = b.kind === current?.kind ? 0 : 1
      return aMatch - bMatch
    })
    .slice(0, count)
}

/* ---------- events ---------- */

/**
 * Drafts are excluded, exactly as the database queries did.
 *
 * Note this deliberately does NOT mirror data/events.publicEvents(), which
 * also returns drafts so the admin can preview them.
 */
export function getPublicEvents(): DokEvent[] {
  return allEvents
    .filter((e) => STATUS_META[e.status].public)
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Upcoming vs past is decided by status, not by comparing to today's date.
 * The site is prerendered, so "today" would freeze at build time — an event
 * would stay "upcoming" forever after its date until someone redeployed.
 * Status is already the source of truth everywhere else on this site.
 */
const PAST: DokEvent['status'][] = ['completed', 'cancelled']

export function getUpcomingEvents(): DokEvent[] {
  return getPublicEvents().filter((e) => !PAST.includes(e.status))
}

/** Most recent first. */
export function getPastEvents(): DokEvent[] {
  return getPublicEvents()
    .filter((e) => e.status === 'completed')
    .reverse()
}

export function getEventBySlug(slug: string): DokEvent | undefined {
  const event = getEvent(slug)
  // a draft must not be reachable by guessing the URL
  return event && STATUS_META[event.status].public ? event : undefined
}

export function getEventsInRegion(regionSlug: string): DokEvent[] {
  return getPublicEvents().filter((e) => e.region === regionSlug)
}

/* ---------- stories ---------- */

export function getPublishedStories(): Story[] {
  return [...stories].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getStory(slug)
}

export function getRelatedStories(slug: string, limit = 3): Story[] {
  return relatedStories(slug, limit)
}

/* ---------- regions ---------- */

export function getAllRegions(): Region[] {
  return regions
}

/** A region only gets a public page once real organisers exist. */
export function getPublishedRegion(slug: string): Region | undefined {
  const region = getRegion(slug)
  return region && region.status !== 'interest' ? region : undefined
}

export function getRegionEventCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const e of getPublicEvents()) {
    counts[e.region] = (counts[e.region] ?? 0) + 1
  }
  return counts
}

/* ---------- resources ---------- */

export function getPublishedResources(): Resource[] {
  return resources
}
