/**
 * The static content layer.
 *
 * Mirrors the read side of src/db/queries.ts, but sourced from the committed
 * TypeScript modules in src/data — so public pages render with no database, no
 * connection string, and nothing to wake up or pay for. Signatures match the
 * database versions deliberately: switching back is an import swap.
 *
 * These return the view types directly, so pages need no adapter.
 */
import { events as allEvents, getEvent, STATUS_META } from '@/data/events'
import type { DokEvent } from '@/data/events'
import { stories, getStory, relatedStories } from '@/data/stories'
import type { Story } from '@/data/stories'
import { regions, getRegion } from '@/data/regions'
import type { Region } from '@/data/regions'
import { resources } from '@/data/resources'
import type { Resource } from '@/data/resources'

/* ---------- events ---------- */

/**
 * Drafts are excluded, exactly as the database queries did.
 *
 * Note this deliberately does NOT use data/events.publicEvents(), which also
 * returns drafts so the admin can preview them. Reusing it here leaked both
 * draft events onto the public list and prerendered their detail pages.
 */
export function getPublicEvents(): DokEvent[] {
  return allEvents
    .filter((e) => STATUS_META[e.status].public)
    .sort((a, b) => a.date.localeCompare(b.date))
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
