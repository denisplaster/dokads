import { definePage, items, line, select, text } from '../fields'
import { TOPIC_GROUPS, topics } from '../../data/topics'
import type { Topic } from '../../data/topics'

const GROUP_KEYS = Object.keys(TOPIC_GROUPS) as Topic['group'][]

export const TOPIC_STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'drafting', label: 'Being written' },
  { value: 'planned', label: 'Planned' },
  { value: 'needs review', label: 'Needs review' },
] as const

export const learn = definePage({
  id: 'learn',
  title: 'Learn',
  path: '/learn',
  help: 'The long versions of the four panels are edited under “Who / What / Where / Why”.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'The big questions'),
        description: text(
          'Description',
          'Who DoKADs are, what Korean adoption was, where the community is, and why any of it matters for the second generation.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'The big\nquestions.'),
        lead: text(
          'Introduction',
          'Who, what, where, and why — the long versions. Plus everything we are working on writing next.',
        ),
        note: line('Handwritten note', 'none of this is homework'),
        figure: line('Picture caption: label before the number', 'Fig.'),
        caption: line(
          'Picture caption: after the question',
          'Artwork is generated, not photographic; we are waiting on the community for real images.',
        ),
      },
    },
    quote: {
      title: 'Quote',
      fields: {
        quote: text('Quote', 'The questions did not end with the first generation. They moved.'),
        cite: line('Attribution', 'The premise of this whole thing'),
      },
    },
    topics: {
      title: 'What we are writing next',
      fields: {
        kicker: line('Section label', 'What we are writing next'),
        lead: text(
          'Introduction',
          'An open editorial queue. If something here matters to you, tell us — the order is not fixed, and we would rather write what people actually need.',
        ),
        groups: items(
          'Group headings',
          { label: line('Heading', '') },
          GROUP_KEYS.map((g) => ({ label: TOPIC_GROUPS[g].label })),
          { fixed: true, itemTitle: 'label', noun: 'group' },
        ),
        statusLabels: items(
          'Status stickers',
          { label: line('Label', '') },
          TOPIC_STATUS_OPTIONS.map((o) => ({ label: o.label })),
          {
            fixed: true,
            itemTitle: 'label',
            noun: 'status',
            help: 'In order: published, being written, planned, needs review.',
          },
        ),
        sensitiveFlag: line(
          'Note before the legal disclaimer on legal topics',
          'Held back on purpose.',
        ),
        list: items(
          'Topics',
          {
            title: line('Title', ''),
            blurb: text('Short description', ''),
            status: select('Status', TOPIC_STATUS_OPTIONS, 'planned'),
            group: select(
              'Group',
              GROUP_KEYS.map((g) => ({ value: g, label: TOPIC_GROUPS[g].label })),
              'basics',
            ),
            href: line('Link (optional)', '', {
              help: 'Where the finished piece lives, e.g. /stories/its-slug. Leave empty until it exists.',
            }),
            sensitive: select(
              'Legal / immigration topic?',
              [
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes — show the legal disclaimer' },
              ],
              'no',
            ),
          },
          topics.map((t) => ({
            title: t.title,
            blurb: t.blurb,
            status: t.status,
            group: t.group,
            href: t.href ?? '',
            sensitive: t.sensitive ? 'yes' : 'no',
          })),
          { itemTitle: 'title', noun: 'topic' },
        ),
      },
    },
    rules: {
      title: 'Legal and immigration standards',
      help: 'The five rules and the disclaimer are edited under Site-wide text → Legal.',
      fields: {
        kicker: line('Section label', 'How we handle legal + immigration content'),
        body: text(
          'Text',
          'People ask about Korean citizenship, the F-4 visa, and residency more than almost anything else. It is also the easiest thing to get badly wrong, so anything we publish on it has to clear all five of these before it goes up.',
        ),
      },
    },
    close: {
      title: 'Bottom of the page',
      fields: {
        headline: text('Headline', 'Something missing?'),
        lead: text(
          'Text',
          'Tell us what you came here looking for and could not find. That is genuinely how this queue gets ordered.',
        ),
        cta: line('Button 1', 'Join and tell us'),
        resources: line('Button 2', 'Community resources'),
      },
    },
  },
})
