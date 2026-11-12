/**
 * The site's vocabulary — status badges, event types, story kinds and so on
 * — with the editor's wording applied.
 *
 * Safe to use in client components: it reads src/generated/labels.json, a
 * tiny file holding only the edits to the "Labels and statuses" page, not the
 * whole content snapshot.
 */
import raw from '@/generated/labels.json'
import type { EventAudience, EventStatus, EventType } from '@/data/events'
import type { StoryKind } from '@/data/stories'
import type { RegionStatus } from '@/data/regions'
import type { Audience, ResourceFormat } from '@/data/resources'
import { resolvePage } from './fields'
import { LABEL_KEYS, labels } from './pages/labels'

const L = resolvePage(labels, (raw as { overrides?: Record<string, unknown> }).overrides ?? {})

function pick<K extends string, V>(keys: readonly K[], values: readonly V[], key: K): V {
  return values[keys.indexOf(key)]
}

export const vocab = {
  status: (s: EventStatus) =>
    pick(LABEL_KEYS.status, L.events.status, s) ?? { label: 'Draft', note: 'Not published yet' },
  eventType: (t: EventType) => pick(LABEL_KEYS.eventType, L.events.types, t)?.label ?? t,
  audience: (a: EventAudience) =>
    pick(LABEL_KEYS.audience, L.events.audiences, a) ?? { label: a, detail: '' },
  storyKind: (k: StoryKind) => pick(LABEL_KEYS.storyKind, L.stories.kinds, k) ?? { label: k, note: '' },
  regionStatus: (s: RegionStatus) =>
    pick(LABEL_KEYS.regionStatus, L.regions.status, s) ?? { label: s, blurb: '' },
  format: (f: ResourceFormat) => pick(LABEL_KEYS.format, L.resources.formats, f) ?? { label: f, verb: f },
  resourceAudience: (a: Audience) =>
    pick(LABEL_KEYS.resourceAudience, L.resources.audiences, a)?.label ?? a,
  brand: L.brand,
  event: L.events,
  story: L.stories,
}
