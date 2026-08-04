/**
 * Maps database rows onto the view types the components already speak.
 *
 * Keeping this boundary means the whole design system stayed untouched when
 * content moved into Postgres, and it is the one place that has to change if
 * the schema and the presentation drift apart.
 */
import type { DbEvent, DbRegion, DbResource, DbStory } from '@/db/schema'
import type { Story, StoryKind } from '@/data/stories'
import type {
  AgePolicy,
  DokEvent,
  EventAudience,
  EventStatus,
  EventType,
  VenueKind,
} from '@/data/events'
import type { Region, RegionStatus } from '@/data/regions'
import type { Audience, Resource, ResourceCard, ResourceFormat } from '@/data/resources'
import type { CollageVariant } from './collage'

export function toStory(r: DbStory): Story {
  return {
    slug: r.slug,
    title: r.title,
    dek: r.dek,
    kind: r.kind as StoryKind,
    byline: r.byline,
    bylineStyle: r.bylineStyle as Story['bylineStyle'],
    location: r.location ?? undefined,
    issue: r.issue,
    readingTime: r.readingTime,
    pullquote: r.pullquote ?? undefined,
    art: (r.art as CollageVariant) ?? undefined,
    featured: r.featured,
    body: r.body ?? [],
    isPlaceholder: true,
  }
}

export function toEvent(r: DbEvent): DokEvent {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    blurb: r.blurb,
    type: r.type as EventType,
    status: r.status as EventStatus,
    date: r.date,
    backupDate: r.backupDate ?? undefined,
    time: r.time,
    timezone: r.timezone,
    region: r.regionSlug,
    venueKind: r.venueKind as VenueKind,
    location: r.location,
    format: r.format as DokEvent['format'],
    audience: r.audience as EventAudience,
    agePolicy: r.agePolicy as AgePolicy,
    cost: r.cost,
    rules: {
      plusOnes: r.plusOnes,
      capacity: r.capacity ?? undefined,
      waitlist: r.waitlist,
      minAge: r.minAge ?? undefined,
      guardianConsentUnder: r.guardianConsentUnder ?? undefined,
      deadline: r.deadline ?? undefined,
      perk: r.perk ?? undefined,
    },
    tentativeNotes: r.tentativeNotes ?? undefined,
    needsFoodInfo: r.needsFoodInfo,
  }
}

export function toRegion(r: DbRegion): Region {
  return {
    slug: r.slug,
    name: r.name,
    country: r.country,
    status: r.status as RegionStatus,
    intro: r.intro ?? undefined,
    organisers: r.organisers ?? undefined,
    socials: r.socials ?? undefined,
    updates: r.updates ?? undefined,
  }
}

export function toResource(r: DbResource): Resource {
  return {
    id: r.id,
    title: r.title,
    blurb: r.blurb,
    format: r.format as ResourceFormat,
    audience: (r.audience ?? []) as Audience[],
    badge: (r.badge as Resource['badge']) ?? undefined,
    card: r.card as ResourceCard,
    link: r.link,
    status: 'open call',
  }
}
