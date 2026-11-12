import type { DokEvent } from '@/data/events'
import type { Story } from '@/data/stories'
import type { Region } from '@/data/regions'
import type { Resource } from '@/data/resources'

/**
 * Everything the public site renders, frozen at build time.
 *
 * scripts/snapshot.ts writes this to src/generated/content.json before every
 * build and dev start. Public pages read only this file, so they never import
 * the database and a visitor can never cause a query. Only public-ready
 * records are included: drafts are not in the bundle at all.
 */
export type ContentSnapshot = {
  source: 'files' | 'database'
  /** when the database was read; null when built from the files */
  takenAt: string | null
  /** soonest first */
  events: DokEvent[]
  /** display order */
  stories: Story[]
  /** display order */
  regions: Region[]
  /** display order */
  resources: Resource[]
  /** editor overrides of page text: page id → "section.field" → value */
  copy: Record<string, Record<string, unknown>>
}
