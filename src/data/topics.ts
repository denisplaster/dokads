/** Planned educational topics. Nothing is written yet — these are the queue. */

export type TopicStatus = 'published' | 'drafting' | 'planned' | 'needs review'

export type Topic = {
  slug: string
  title: string
  blurb: string
  status: TopicStatus
  group: 'basics' | 'family' | 'identity' | 'korea' | 'practical' | 'community'
  /** where the published piece lives, once it exists */
  href?: string
  /** legal / immigration content carries extra obligations — see LEGAL_RULES */
  sensitive?: boolean
  lastReviewed?: string
}

export const TOPIC_GROUPS: Record<Topic['group'], { label: string; tone: string }> = {
  basics: { label: 'Start with the basics', tone: 'yellow' },
  family: { label: 'Family + conversations', tone: 'peach' },
  identity: { label: 'Identity + race', tone: 'lavender' },
  korea: { label: 'Korea', tone: 'blue' },
  practical: { label: 'Practical + preservation', tone: 'green' },
  community: { label: 'Building community', tone: 'pink' },
}

export const topics: Topic[] = [
  {
    slug: 'what-does-dokad-mean',
    href: '/stories/what-even-is-a-dokad',
    title: 'What does DoKAD mean?',
    blurb: 'The term, where it came from, and why it is a handle rather than a test.',
    status: 'published',
    group: 'basics',
  },
  {
    slug: 'am-i-a-dokad',
    href: '/am-i-a-dokad',
    title: 'Am I a DoKAD?',
    blurb: 'A simple walk through who the word describes, with examples.',
    status: 'published',
    group: 'basics',
  },
  {
    slug: 'a-short-history-of-korean-adoption',
    href: '/stories/a-short-history-of-korean-adoption',
    title: 'A short history of Korean adoption',
    blurb: 'Where the programme came from, how it scaled, and the reckoning still under way.',
    status: 'published',
    group: 'basics',
  },
  {
    slug: 'why-descendants-experience-adoption-differently',
    href: '/stories/why-descendants-experience-adoption-differently',
    title: 'Why descendants may experience adoption differently',
    blurb: 'Inheriting a history you did not live through — and the specific shape that takes.',
    status: 'published',
    group: 'basics',
  },
  {
    slug: 'talking-to-your-parent',
    href: '/stories/talking-to-your-adoptee-parent',
    title: 'Talking to your Korean adoptee parent about adoption',
    blurb: 'How people have started the conversation, and what to do when it does not go well.',
    status: 'published',
    group: 'family',
  },
  {
    slug: 'what-descendants-want-to-know',
    title: 'What descendants may want to know about family history',
    blurb: 'The questions that come up most, and which ones have findable answers.',
    status: 'planned',
    group: 'family',
  },
  {
    slug: 'race-and-mixed-race-identity',
    title: 'Race and mixed-race identity',
    blurb: 'Being read as Korean, not being read as Korean, and everything in between.',
    status: 'planned',
    group: 'identity',
  },
  {
    slug: 'connected-or-disconnected',
    href: '/stories/feeling-connected-or-disconnected-from-korea',
    title: 'Feeling connected — or disconnected — from Korea',
    blurb: 'Both are common. Neither is the correct one.',
    status: 'published',
    group: 'identity',
  },
  {
    slug: 'visiting-korea-as-a-descendant',
    href: '/stories/visiting-korea-as-a-descendant',
    title: 'Visiting Korea as a descendant of an adoptee',
    blurb: 'What the trip is like when it is your parent’s history and your first time.',
    status: 'published',
    group: 'korea',
  },
  {
    slug: 'korean-language-and-culture',
    href: '/resources',
    title: 'Korean language and culture resources',
    blurb: 'Starting points that do not assume you grew up with any of it.',
    status: 'published',
    group: 'korea',
  },
  {
    slug: 'visa-and-immigration-options',
    title: 'Korean immigration and visa options, including the F-4',
    blurb:
      'Educational background on the pathways people ask about most. Not yet written — this one needs review before it goes anywhere near publication.',
    status: 'needs review',
    group: 'korea',
    sensitive: true,
  },
  {
    slug: 'preserving-files-and-photos',
    href: '/stories/preserving-adoption-files-photos-and-stories',
    title: 'Preserving adoption files, photographs, letters, and family stories',
    blurb: 'Practical steps, before the paper degrades or the person who remembers is gone.',
    status: 'published',
    group: 'practical',
  },
  {
    slug: 'starting-a-local-gathering',
    title: 'Starting a local DoKAD gathering',
    blurb: 'What worked in Minnesota, written so it can be copied anywhere.',
    status: 'planned',
    group: 'community',
  },
  {
    slug: 'adoptees-and-descendants-supporting-each-other',
    title: 'How Korean adoptees and their descendants can support one another',
    blurb: 'Two overlapping communities with different needs.',
    status: 'planned',
    group: 'community',
  },
  {
    slug: 'community-led-research',
    title: 'Community-led research about descendants of adoptees',
    blurb: 'What we would want studied, and who should be asking the questions.',
    status: 'planned',
    group: 'community',
  },
]

/** Non-negotiable rules for legal, immigration, citizenship, or visa content. */
export const LEGAL_RULES = [
  'Reviewed for current accuracy before publication',
  'Shows the date it was last reviewed',
  'Cites official sources',
  'Carries a disclaimer that it is educational information, not legal advice',
  'Never promises eligibility based only on a family relationship',
]

export const LEGAL_DISCLAIMER =
  'This is educational information, not legal advice. Immigration and citizenship rules change, and eligibility is never determined by a family relationship alone. Check official sources and, where it matters, talk to a qualified professional.'
