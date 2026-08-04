/**
 * Turns the original hand-authored content modules into database rows.
 *
 * The TypeScript files under src/data are now *seed* material and the type
 * vocabulary (statuses, event types, audiences, choice lists). The database
 * is the source of truth once seeded — do not edit content in both places.
 */
import { events as seedEvents } from '../data/events'
import { stories as seedStories } from '../data/stories'
import { regions as seedRegions } from '../data/regions'
import { resources as seedResources } from '../data/resources'
import type { InferInsertModel } from 'drizzle-orm'
import type { events, regions, resources, stories } from './schema'

export const eventRows: InferInsertModel<typeof events>[] = seedEvents.map((e) => ({
  id: e.id,
  slug: e.slug,
  title: e.title,
  blurb: e.blurb,
  type: e.type,
  status: e.status,
  date: e.date,
  backupDate: e.backupDate ?? null,
  time: e.time,
  timezone: e.timezone,
  regionSlug: e.region,
  venueKind: e.venueKind,
  location: e.location,
  format: e.format,
  audience: e.audience,
  agePolicy: e.agePolicy,
  cost: e.cost,
  plusOnes: e.rules.plusOnes,
  capacity: e.rules.capacity ?? null,
  waitlist: e.rules.waitlist,
  minAge: e.rules.minAge ?? null,
  guardianConsentUnder: e.rules.guardianConsentUnder ?? null,
  deadline: e.rules.deadline ?? null,
  perk: e.rules.perk ?? null,
  tentativeNotes: e.tentativeNotes ?? [],
  needsFoodInfo: e.needsFoodInfo ?? false,
}))

export const storyRows: InferInsertModel<typeof stories>[] = seedStories.map((s) => ({
  slug: s.slug,
  title: s.title,
  dek: s.dek,
  kind: s.kind,
  byline: s.byline,
  bylineStyle: s.bylineStyle,
  location: s.location ?? null,
  issue: s.issue,
  readingTime: s.readingTime,
  pullquote: s.pullquote ?? null,
  art: s.art ?? null,
  featured: s.featured ?? false,
  body: s.body,
  // Issue 001 is not out; these are layout copy and stay flagged as such
  status: 'published',
  isPlaceholder: true,
}))

export const regionRows: InferInsertModel<typeof regions>[] = seedRegions.map((r, i) => ({
  slug: r.slug,
  name: r.name,
  country: r.country,
  status: r.status,
  intro: r.intro ?? null,
  organisers: r.organisers ?? [],
  socials: r.socials ?? [],
  updates: r.updates ?? [],
  sortOrder: i,
}))

export const resourceRows: InferInsertModel<typeof resources>[] = seedResources.map((r, i) => ({
  id: r.id,
  title: r.title,
  blurb: r.blurb,
  format: r.format,
  audience: r.audience,
  badge: r.badge ?? null,
  card: r.card,
  link: r.link,
  status: r.status,
  published: true,
  sortOrder: i,
}))
