/**
 * ── EDITORIAL NOTE ────────────────────────────────────────────────────
 * The directory launches empty on purpose: entries are meant to be
 * nominated by the community, not assembled by us. The records below
 * describe the *kind* of thing each shelf collects so the filters and
 * card layouts can be built and tested. They deliberately carry no
 * titles, authors, or links — nothing here should be mistaken for a real
 * recommendation. Replace with real entries as they come in.
 * ─────────────────────────────────────────────────────────────────────
 */

export type ResourceFormat =
  | 'read'
  | 'watch'
  | 'listen'
  | 'connect'
  | 'search'
  | 'learn'

export const FORMATS: Record<ResourceFormat, { label: string; verb: string }> = {
  read: { label: 'Read', verb: 'Read this' },
  watch: { label: 'Watch', verb: 'Watch this' },
  listen: { label: 'Listen', verb: 'Listen' },
  connect: { label: 'Connect', verb: 'Find your people' },
  search: { label: 'Search + records', verb: 'Research corner' },
  learn: { label: 'Background', verb: 'Start here' },
}

export type Audience = 'dokads' | 'parents' | 'teens' | 'korea' | 'everyone'

export const AUDIENCES: Record<Audience, string> = {
  everyone: 'Everyone',
  dokads: 'For DoKADs',
  parents: 'For parents',
  teens: 'For teens',
  korea: 'Going to Korea?',
}

export type ResourceCard = 'index' | 'sticky' | 'bookmark' | 'library' | 'clipping'

export type Resource = {
  id: string
  /** what this shelf collects — a description, not a title */
  title: string
  blurb: string
  format: ResourceFormat
  audience: Audience[]
  badge?: 'Start here' | 'Community favourite' | 'Most asked about'
  card: ResourceCard
  /** null until a real recommendation fills the slot */
  link: string | null
  status: 'open call'
}

export const resources: Resource[] = [
  {
    id: 'r1',
    title: 'A plain-language history of Korean adoption',
    blurb:
      'Where the programmes came from, how they scaled, and what changed in the 1990s and 2000s. The context most of us were never given.',
    format: 'learn',
    audience: ['everyone', 'teens'],
    badge: 'Start here',
    card: 'index',
    link: null,
    status: 'open call',
  },
  {
    id: 'r2',
    title: 'Memoirs by Korean adoptees',
    blurb:
      'First-generation writers on their own terms. The shelf DoKADs most often start with when they want their parent’s side of it.',
    format: 'read',
    audience: ['dokads', 'parents'],
    badge: 'Community favourite',
    card: 'library',
    link: null,
    status: 'open call',
  },
  {
    id: 'r3',
    title: 'Documentaries made by adoptees, not about them',
    blurb: 'Films where the person holding the camera has a stake in the story.',
    format: 'watch',
    audience: ['everyone'],
    card: 'clipping',
    link: null,
    status: 'open call',
  },
  {
    id: 'r4',
    title: 'Podcasts on identity, family, and return',
    blurb: 'Long-form conversation, usually adoptee-hosted. Good for a commute or a long walk.',
    format: 'listen',
    audience: ['dokads', 'teens'],
    card: 'sticky',
    link: null,
    status: 'open call',
  },
  {
    id: 'r5',
    title: 'Birth-family search: how it actually works',
    blurb:
      'Agencies, DNA databases, Korean government records, and realistic expectations. Written for descendants who are searching on a parent’s behalf.',
    format: 'search',
    audience: ['dokads', 'korea'],
    badge: 'Most asked about',
    card: 'index',
    link: null,
    status: 'open call',
  },
  {
    id: 'r6',
    title: 'Talking to your kid about your adoption',
    blurb: 'For first-generation adoptees who are now parents and unsure where to start.',
    format: 'learn',
    audience: ['parents'],
    card: 'sticky',
    link: null,
    status: 'open call',
  },
  {
    id: 'r7',
    title: 'First trip to Korea: practical guides',
    blurb:
      'Visas, language, birth-search appointments, and what people say they wish they had booked differently.',
    format: 'search',
    audience: ['korea'],
    card: 'bookmark',
    link: null,
    status: 'open call',
  },
  {
    id: 'r8',
    title: 'Adoptee-led organisations and meetups',
    blurb: 'Groups that have been doing this longer than we have. Many welcome descendants.',
    format: 'connect',
    audience: ['everyone', 'dokads'],
    card: 'bookmark',
    link: null,
    status: 'open call',
  },
  {
    id: 'r9',
    title: 'Learning Korean when nobody at home speaks it',
    blurb: 'Beginner routes that do not assume a heritage-speaker household.',
    format: 'learn',
    audience: ['teens', 'dokads'],
    card: 'library',
    link: null,
    status: 'open call',
  },
  {
    id: 'r10',
    title: 'Mental-health support that gets adoption',
    blurb:
      'Finding a therapist who already understands adoption and race, so you do not spend six sessions explaining it.',
    format: 'connect',
    audience: ['everyone', 'parents'],
    card: 'clipping',
    link: null,
    status: 'open call',
  },
  {
    id: 'r11',
    title: 'Academic research, translated into English',
    blurb: 'The scholarship on transnational adoption, minus the paywall voice.',
    format: 'read',
    audience: ['everyone'],
    card: 'index',
    link: null,
    status: 'open call',
  },
  {
    id: 'r12',
    title: 'For teachers assigning a family-tree project',
    blurb:
      'What to do instead, and why the standard version of the assignment lands badly for a lot of students.',
    format: 'learn',
    audience: ['teens', 'parents'],
    card: 'sticky',
    link: null,
    status: 'open call',
  },
]
