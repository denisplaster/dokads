import type { CollageVariant } from '../lib/collage'

/**
 * ── EDITORIAL NOTE ────────────────────────────────────────────────────
 * Issue 001 has not been published yet. Everything below is placeholder
 * copy written to build and test the layouts — it is not a record of any
 * real person's experience, and no entry is attributed to a real
 * contributor. Replace this file with real submissions before launch and
 * delete `isPlaceholder`.
 * ─────────────────────────────────────────────────────────────────────
 */

export type StoryKind =
  | 'essay'
  | 'interview'
  | 'photo'
  | 'poetry'
  | 'audio'
  | 'question'
  | 'explainer'

export const STORY_KINDS: Record<StoryKind, { label: string; note: string }> = {
  essay: { label: 'Personal essay', note: 'First person, written' },
  interview: { label: 'Interview', note: 'Two people, in conversation' },
  photo: { label: 'Photo story', note: 'Images lead, words follow' },
  poetry: { label: 'Poetry', note: 'Short form' },
  audio: { label: 'Audio', note: 'Listen instead of read' },
  question: { label: 'Community question', note: 'Open thread' },
  explainer: { label: 'Explainer', note: 'Context and background' },
}

export type Story = {
  slug: string
  title: string
  dek: string
  kind: StoryKind
  byline: string
  /** how the contributor chose to be credited */
  bylineStyle: 'full name' | 'first name' | 'pseudonym' | 'anonymous'
  location?: string
  issue: string
  readingTime: number
  pullquote?: string
  art?: CollageVariant
  featured?: boolean
  /** paragraphs; `> ` prefix renders as a pull quote */
  body: string[]
  isPlaceholder: true
}

export const stories: Story[] = [
  {
    slug: 'the-questions-i-inherited',
    title: 'The questions I inherited',
    dek: 'My mom was adopted from Korea in 1985. I grew up with her answers, and with the questions she never got any answers to.',
    kind: 'essay',
    byline: 'By Nari',
    bylineStyle: 'first name',
    location: 'Minneapolis, MN',
    issue: '001',
    readingTime: 6,
    pullquote: 'I did not inherit a country. I inherited a set of open questions.',
    art: 'cut',
    featured: true,
    isPlaceholder: true,
    body: [
      'This is placeholder copy. It exists so the article layout can be designed and tested before Issue 001 opens for real submissions.',
      'Personal essays in DOKADS run long or short. They can be built around one memory, one object, one conversation, or one question that has never quite closed. There is no required arc, and there is no requirement that the piece resolve.',
      '> I did not inherit a country. I inherited a set of open questions.',
      'Contributors choose how they are credited: full name, first name only, a pseudonym, or anonymous. That choice belongs to the writer and can be changed later.',
      'Paragraph width is capped for readability even inside the most decorated pages, and the type here is set a step larger than the interface type. Long reads should be comfortable.',
    ],
  },
  {
    slug: 'two-generations-one-kitchen-table',
    title: 'Two generations, one kitchen table',
    dek: 'A DoKAD and her father — adopted at four — talk about what got passed down, what got skipped, and what they are still negotiating.',
    kind: 'interview',
    byline: 'Interview by the DOKADS editors',
    bylineStyle: 'full name',
    location: 'Seattle, WA',
    issue: '001',
    readingTime: 11,
    pullquote: 'You kept saying you had nothing to teach me. You taught me anyway.',
    art: 'stack',
    featured: true,
    isPlaceholder: true,
    body: [
      'This is placeholder copy for the interview layout.',
      'Interviews are formatted as a labelled exchange so the two voices stay visually distinct. Editors trim for length and clarity, and both participants review the transcript before publication.',
      '> You kept saying you had nothing to teach me. You taught me anyway.',
      'Either participant may withdraw before publication, and either may ask for a section to be cut afterwards.',
    ],
  },
  {
    slug: 'what-even-is-a-dokad',
    title: 'What even is a DoKAD?',
    dek: 'The short version, the long version, and why the term exists at all.',
    kind: 'explainer',
    byline: 'DOKADS editorial',
    bylineStyle: 'full name',
    issue: '001',
    readingTime: 4,
    art: 'grid',
    featured: true,
    isPlaceholder: true,
    body: [
      'DoKAD is shorthand for descendant of a Korean adoptee — the child, grandchild, or great-grandchild of someone who was adopted from Korea.',
      'Roughly 200,000 children were adopted out of South Korea from the 1950s onward, most of them to the United States and Western Europe. The first generation is now well into adulthood, and many have children of their own. That second and third generation is who DOKADS is for.',
      '> There is no single way to be a DoKAD.',
      'Some DoKADs grew up close to Korean culture. Some grew up with almost none of it. Some are mixed race, some are not. Some have birth-family information; most do not. Some parents talk about adoption constantly; some have never talked about it once.',
      'The word is a useful handle, not a test. Nobody has to qualify.',
    ],
  },
  {
    slug: 'things-my-halmoni-would-have-said',
    title: 'Things my halmoni would have said',
    dek: 'Six short poems about a grandmother who was never findable.',
    kind: 'poetry',
    byline: 'By J.',
    bylineStyle: 'pseudonym',
    issue: '001',
    readingTime: 3,
    pullquote: 'I set a place for a person I invented.',
    art: 'arc',
    isPlaceholder: true,
    body: [
      'Placeholder copy for the poetry layout.',
      'Poetry is set on a narrower measure with more space around it, and the display face is used for titles only — never for the poem itself.',
      '> I set a place for a person I invented.',
    ],
  },
  {
    slug: 'the-airport-photo',
    title: 'The airport photo',
    dek: 'Nine images from a family archive, scanned and annotated by the person who inherited the box.',
    kind: 'photo',
    byline: 'Anonymous',
    bylineStyle: 'anonymous',
    location: 'Chicago, IL',
    issue: '001',
    readingTime: 5,
    art: 'strip',
    isPlaceholder: true,
    body: [
      'Placeholder copy for the photo-story layout.',
      'Photo stories run image-first with handwritten-style captions underneath. Until the community sends real photographs, this page renders abstract placeholder art instead of stock photography.',
      'Anyone submitting family images is asked to confirm that everyone identifiable in them has agreed to publication.',
    ],
  },
  {
    slug: 'do-you-call-it-going-back',
    title: 'Do you call it “going back”?',
    dek: 'An open thread on the language DoKADs use for a first trip to Korea — and why none of the obvious verbs fit.',
    kind: 'question',
    byline: 'From the community',
    bylineStyle: 'full name',
    issue: '001',
    readingTime: 2,
    pullquote: 'Returning, visiting, going back, going over. None of them are quite right.',
    art: 'halftone',
    isPlaceholder: true,
    body: [
      'Placeholder copy for the community-question layout.',
      'Community questions are short prompts with responses collected from members. Responses are published with whatever credit the responder chose, and can be removed on request at any time.',
      '> Returning, visiting, going back, going over. None of them are quite right.',
    ],
  },
  {
    slug: 'a-recording-of-my-dad-explaining',
    title: 'A recording of my dad explaining, twice',
    dek: 'Eleven minutes of audio, recorded four years apart, in which the same story comes out differently.',
    kind: 'audio',
    byline: 'By Simon P.',
    bylineStyle: 'first name',
    issue: '001',
    readingTime: 11,
    art: 'cut',
    isPlaceholder: true,
    body: [
      'Placeholder copy for the audio layout.',
      'Audio pieces publish with a full transcript. The transcript is not optional — it is how the piece stays usable for people who cannot or would rather not listen.',
    ],
  },
  {
    slug: 'the-word-for-cousin',
    title: 'The word for cousin',
    dek: 'On learning Korean kinship terms for relatives you have never met and may never meet.',
    kind: 'essay',
    byline: 'By Hana Lee',
    bylineStyle: 'full name',
    location: 'Toronto, ON',
    issue: '001',
    readingTime: 7,
    pullquote: 'Korean has a word for exactly which cousin you are. I had nobody to use it on.',
    art: 'stack',
    isPlaceholder: true,
    body: [
      'Placeholder copy for a standard essay layout.',
      'Korean kinship terms are precise in a way English is not — they encode which side of the family a relative is on and their relative age. Learning them can feel like being handed a very detailed map of a place you have not been.',
      '> Korean has a word for exactly which cousin you are. I had nobody to use it on.',
    ],
  },
]

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug)
}

export function relatedStories(slug: string, count = 3) {
  const current = stories.find((s) => s.slug === slug)
  return stories
    .filter((s) => s.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.kind === current?.kind ? 0 : 1
      const bMatch = b.kind === current?.kind ? 0 : 1
      return aMatch - bMatch
    })
    .slice(0, count)
}
