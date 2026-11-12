import { definePage, items, line, text } from '../fields'
import { AUDIENCE_META, EVENT_TYPES, STATUS_META } from '../../data/events'
import type { EventAudience, EventStatus, EventType } from '../../data/events'
import { STORY_KINDS } from '../../data/stories'
import type { StoryKind } from '../../data/stories'
import { REGION_STATUS_META } from '../../data/regions'
import type { RegionStatus } from '../../data/regions'
import { AUDIENCES, FORMATS } from '../../data/resources'
import type { Audience, ResourceFormat } from '../../data/resources'

/**
 * Key order for each vocabulary. Item i of a list below belongs to KEYS[i] —
 * the keys are what the database stores; only the words shown are editable.
 */
export const LABEL_KEYS = {
  status: (Object.keys(STATUS_META) as EventStatus[]).filter((s) => s !== 'draft'),
  eventType: Object.keys(EVENT_TYPES) as EventType[],
  audience: Object.keys(AUDIENCE_META) as EventAudience[],
  storyKind: Object.keys(STORY_KINDS) as StoryKind[],
  regionStatus: Object.keys(REGION_STATUS_META) as RegionStatus[],
  format: Object.keys(FORMATS) as ResourceFormat[],
  resourceAudience: Object.keys(AUDIENCES) as Audience[],
}

const keyHelp = (keys: readonly string[]) => `In order: ${keys.join(', ')}.`

export const labels = definePage({
  id: 'labels',
  title: 'Labels and statuses',
  path: null,
  help: 'The short words used on cards and badges across the site — event statuses, event types, story kinds and so on. Changing a label here changes it everywhere it appears.',
  sections: {
    brand: {
      title: 'Masthead',
      fields: {
        issue: line('Current issue number', '001', {
          help: 'Shown in the “DOKADS / Issue 001” label at the top of most pages.',
        }),
        tagline: line('Under the logo in the footer', 'Descendants of Korean Adoptees'),
      },
    },
    events: {
      title: 'Events',
      fields: {
        status: items(
          'Status badges',
          { label: line('Badge', ''), note: line('Explanation (Events page key)', '') },
          LABEL_KEYS.status.map((s) => ({ label: STATUS_META[s].label, note: STATUS_META[s].note })),
          { fixed: true, itemTitle: 'label', noun: 'status', help: keyHelp(LABEL_KEYS.status) },
        ),
        types: items(
          'Event types',
          { label: line('Label', '') },
          LABEL_KEYS.eventType.map((t) => ({ label: EVENT_TYPES[t] })),
          { fixed: true, itemTitle: 'label', noun: 'type' },
        ),
        audiences: items(
          'Who it is for',
          { label: line('Label', ''), detail: text('Explanation (event page)', '') },
          LABEL_KEYS.audience.map((a) => ({
            label: AUDIENCE_META[a].label,
            detail: AUDIENCE_META[a].detail,
          })),
          { fixed: true, itemTitle: 'label', noun: 'audience' },
        ),
        online: line('Card tag: online', 'Online'),
        inPerson: line('Card tag: in person', 'In person'),
        free: line('Card tag: free', 'Free'),
        when: line('Card row: when', 'When'),
        where: line('Card row: where', 'Where'),
        ages: line('Card row: ages', 'Ages'),
        provisional: line(
          'Card note on tentative events',
          'Not confirmed yet — details can still change.',
        ),
      },
    },
    stories: {
      title: 'Stories',
      fields: {
        kinds: items(
          'Story kinds',
          { label: line('Label', ''), note: line('Description (Stories page filter)', '') },
          LABEL_KEYS.storyKind.map((k) => ({ label: STORY_KINDS[k].label, note: STORY_KINDS[k].note })),
          { fixed: true, itemTitle: 'label', noun: 'kind' },
        ),
        minRead: line('Reading time, after the number', 'min read'),
        minShort: line('Reading time, short', 'min'),
        readThis: line('Sticker on the lead story', 'Read this'),
      },
    },
    regions: {
      title: 'Local groups',
      fields: {
        status: items(
          'Group statuses',
          { label: line('Label', ''), blurb: line('Explanation', '') },
          LABEL_KEYS.regionStatus.map((s) => ({
            label: REGION_STATUS_META[s].label,
            blurb: REGION_STATUS_META[s].blurb,
          })),
          { fixed: true, itemTitle: 'label', noun: 'status', help: keyHelp(LABEL_KEYS.regionStatus) },
        ),
      },
    },
    resources: {
      title: 'Resources',
      fields: {
        formats: items(
          'Shelves',
          { label: line('Name', ''), verb: line('Heading on the shelf', '') },
          LABEL_KEYS.format.map((f) => ({ label: FORMATS[f].label, verb: FORMATS[f].verb })),
          { fixed: true, itemTitle: 'label', noun: 'shelf' },
        ),
        audiences: items(
          'Audience filters',
          { label: line('Label', '') },
          LABEL_KEYS.resourceAudience.map((a) => ({ label: AUDIENCES[a] })),
          { fixed: true, itemTitle: 'label', noun: 'filter' },
        ),
      },
    },
  },
})
