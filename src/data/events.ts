/**
 * ── EDITORIAL NOTE ────────────────────────────────────────────────────
 * Nothing here is confirmed. Every record carries an explicit `status`,
 * and the UI is required to show it. Do not move an event to
 * 'registration open' — and do not publish a venue, date, beverage
 * offer, or attendance policy as final — until it has been approved.
 * ─────────────────────────────────────────────────────────────────────
 */

/** Event lifecycle. The UI must render this on every card and detail page. */
export type EventStatus =
  | 'draft'
  | 'tentative'
  | 'registration opening soon'
  | 'registration open'
  | 'waitlist'
  | 'sold out'
  | 'cancelled'
  | 'completed'

export const STATUS_META: Record<
  EventStatus,
  { label: string; tone: string; note: string; public: boolean }
> = {
  draft: { label: 'Draft', tone: 'warm-gray', note: 'Not published yet', public: false },
  tentative: {
    label: 'Tentative',
    tone: 'yellow',
    note: 'Date, venue, and details may still change',
    public: true,
  },
  'registration opening soon': {
    label: 'Registration opening soon',
    tone: 'peach',
    note: 'Details confirmed — sign-up not open yet',
    public: true,
  },
  'registration open': {
    label: 'Registration open',
    tone: 'green',
    note: 'Come join us',
    public: true,
  },
  waitlist: { label: 'Waitlist', tone: 'lavender', note: 'Full — add your name', public: true },
  'sold out': { label: 'Full', tone: 'ink', note: 'No spots left', public: true },
  cancelled: { label: 'Cancelled', tone: 'red', note: 'Not happening', public: true },
  completed: { label: 'Past event', tone: 'warm-gray', note: 'This one already happened', public: true },
}

/** Programme categories, drawn from what early respondents asked for. */
export type EventType =
  | 'casual social'
  | 'coffee meetup'
  | 'guided discussion'
  | 'dokad 101'
  | 'educational'
  | 'korean culture'
  | 'korean language'
  | 'korean cooking'
  | 'family history'
  | 'korea travel'
  | 'preservation'
  | 'research'
  | 'online gathering'

export const EVENT_TYPES: Record<EventType, string> = {
  'casual social': 'Casual social meetup',
  'coffee meetup': 'Coffee meetup',
  'guided discussion': 'Guided discussion',
  'dokad 101': 'DoKAD 101',
  educational: 'Educational session',
  'korean culture': 'Korean culture',
  'korean language': 'Korean language',
  'korean cooking': 'Korean cooking',
  'family history': 'Family history',
  'korea travel': 'Korea travel',
  preservation: 'File + story preservation',
  research: 'Research discussion',
  'online gathering': 'Online gathering',
}

/** Who an event is for. Always displayed — never left to inference. */
export type EventAudience =
  | 'dokads only'
  | 'adoptees and dokads'
  | 'family members welcome'
  | 'open to all'

export const AUDIENCE_META: Record<EventAudience, { label: string; detail: string }> = {
  'dokads only': {
    label: 'DoKADs only',
    detail:
      'This gathering is intended for children, grandchildren, and other descendants of Korean adoptees. You will not be asked to prove your identity or disclose private adoption information.',

  },
  'adoptees and dokads': {
    label: 'Adoptees + DoKADs',
    detail: 'Open to Korean adoptees and their descendants.',
  },
  'family members welcome': {
    label: 'Family members welcome',
    detail: 'Bring the people you want with you — partners, siblings, parents, kids.',
  },
  'open to all': {
    label: 'Open to everyone',
    detail: 'Anyone curious about Korean adoption and its descendants is welcome.',
  },
}

export type AgePolicy = 'all ages' | 'under-18 friendly' | '18+' | '21+'

export type VenueKind =
  | 'coffee shop'
  | 'library'
  | 'community center'
  | 'park'
  | 'restaurant'
  | 'university'
  | 'online'
  | 'other'

export type DokEvent = {
  id: string
  slug: string
  title: string
  blurb: string
  type: EventType
  status: EventStatus
  /** ISO date. Marked tentative until approved. */
  date: string
  backupDate?: string
  time: string
  timezone: string
  /** region slug — see data/regions.ts */
  region: string
  venueKind: VenueKind
  /** kept vague on purpose while status is tentative */
  location: string
  format: 'online' | 'in person' | 'hybrid'
  audience: EventAudience
  agePolicy: AgePolicy
  cost: string
  /** registration configuration */
  rules: {
    minAge?: number
    guardianConsentUnder?: number
    plusOnes: boolean
    capacity?: number
    waitlist: boolean
    deadline?: string
    perk?: string
  }
  /** anything not yet approved, called out plainly on the page */
  tentativeNotes?: string[]
  needsFoodInfo?: boolean
}

export const events: DokEvent[] = [
  {
    id: 'mn-coffee-001',
    slug: 'minnesota-dokad-coffee-meetup',
    title: 'Minnesota DoKAD Coffee Meetup',
    blurb:
      'The first one. An informal Sunday-afternoon coffee meetup for descendants of Korean adoptees in the Twin Cities — mostly just to meet each other and see who is out there.',
    type: 'coffee meetup',
    status: 'tentative',
    date: '2026-09-27',
    backupDate: '2026-09-20',
    time: '12:00 PM',
    timezone: 'Central Time',
    region: 'minnesota',
    venueKind: 'coffee shop',
    location: 'A coffee shop in Minneapolis, MN',
    format: 'in person',
    audience: 'dokads only',
    agePolicy: 'all ages',
    cost: 'Free',
    rules: {
      plusOnes: false,
      waitlist: true,
      perk: 'One complimentary drink per registered attendee',
    },
    tentativeNotes: [
      'The date is not locked. Sunday 27 September is the target; Sunday 20 September is the backup.',
      'The venue is still being chosen — we know it will be a coffee shop in Minneapolis.',
      'The complimentary drink is hoped-for, not yet confirmed.',
      'For this first one we are keeping it to DoKADs only, with no plus-ones, so it stays small enough to actually talk.',
    ],
  },
  {
    id: 'dokad-101-online',
    slug: 'dokad-101-online-intro',
    title: 'DoKAD 101 — an online intro',
    blurb:
      'A short, plain-language session on what “descendant of a Korean adoptee” means, where the term came from, and what this community is trying to be. Bring questions; no background needed.',
    type: 'dokad 101',
    status: 'registration opening soon',
    date: '2026-10-15',
    time: '7:00 PM',
    timezone: 'Central Time',
    region: 'online',
    venueKind: 'online',
    location: 'Online video call',
    format: 'online',
    audience: 'open to all',
    agePolicy: 'all ages',
    cost: 'Free',
    rules: { plusOnes: true, waitlist: false, capacity: 100 },
  },
  {
    id: 'guided-convo-parents',
    slug: 'guided-conversation-talking-to-your-parent',
    title: 'Guided conversation: talking to your adoptee parent',
    blurb:
      'A facilitated small-group discussion for descendants who want to ask a parent about their adoption and are not sure how to start — or whether to start at all.',
    type: 'guided discussion',
    status: 'tentative',
    date: '2026-11-08',
    time: '2:00 PM',
    timezone: 'Central Time',
    region: 'online',
    venueKind: 'online',
    location: 'Online video call',
    format: 'online',
    audience: 'dokads only',
    agePolicy: 'under-18 friendly',
    cost: 'Free',
    rules: {
      plusOnes: false,
      waitlist: true,
      capacity: 12,
      guardianConsentUnder: 16,
    },
    tentativeNotes: [
      'Format and facilitator are still being worked out with the community.',
      'Group size will be capped so everyone can actually speak.',
    ],
  },
  {
    id: 'mn-korean-cooking',
    slug: 'minnesota-korean-cooking-night',
    title: 'Korean cooking night (idea stage)',
    blurb:
      'One dish, cooked together, in a community kitchen. Requested by several early survey respondents — we are looking for a space and someone who wants to lead it.',
    type: 'korean cooking',
    status: 'draft',
    date: '2027-01-17',
    time: 'Afternoon',
    timezone: 'Central Time',
    region: 'minnesota',
    venueKind: 'community center',
    location: 'Twin Cities — venue not found yet',
    format: 'in person',
    audience: 'family members welcome',
    agePolicy: 'all ages',
    cost: 'To be decided',
    rules: { plusOnes: true, waitlist: false },
    needsFoodInfo: true,
    tentativeNotes: ['This is an idea, not a plan. Tell us if you want to help make it happen.'],
  },
  {
    id: 'preservation-workshop',
    slug: 'preserving-files-photos-and-stories',
    title: 'Preserving files, photos, and stories',
    blurb:
      'A practical workshop on scanning, transcribing, and safely storing adoption paperwork, letters, and family photographs — before they degrade or get lost.',
    type: 'preservation',
    status: 'draft',
    date: '2027-02-21',
    time: 'Afternoon',
    timezone: 'Central Time',
    region: 'online',
    venueKind: 'online',
    location: 'Online',
    format: 'online',
    audience: 'adoptees and dokads',
    agePolicy: 'all ages',
    cost: 'Free',
    rules: { plusOnes: true, waitlist: false },
    tentativeNotes: ['Early planning. No date confirmed.'],
  },
]

/** Events that are safe to show publicly, soonest first. */
export function publicEvents() {
  return [...events]
    .filter((e) => STATUS_META[e.status].public || e.status === 'draft')
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug)
}

export function eventsInRegion(region: string) {
  return publicEvents().filter((e) => e.region === region)
}

export function formatEventDate(iso: string, opts: { long?: boolean } = {}) {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    weekday: opts.long ? 'long' : undefined,
    month: opts.long ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
