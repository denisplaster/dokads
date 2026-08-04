/**
 * Regional chapters.
 *
 * RULE: only publish a region page when real organisers and confirmed
 * information exist. Everything else stays `status: 'interest'`, which
 * renders as “nobody is running this yet — want to?” rather than as a
 * chapter that does not exist.
 */

export type RegionStatus = 'active' | 'forming' | 'interest'

export type Region = {
  slug: string
  name: string
  country: string
  status: RegionStatus
  /** short intro shown at the top of the region page */
  intro?: string
  organisers?: { name: string; role: string }[]
  socials?: { label: string; href: string | null; note?: string }[]
  updates?: { date: string; text: string }[]
}

export const regions: Region[] = [
  {
    slug: 'minnesota',
    name: 'Minnesota DoKADs',
    country: 'United States',
    status: 'forming',
    intro:
      'Minnesota DoKADs is a growing community for descendants of Korean adoptees in the Twin Cities and throughout Minnesota. Early gatherings will focus on meeting one another, building relationships, and learning what kinds of programs the community wants next.',
    organisers: [{ name: 'Organising group forming', role: 'Volunteers wanted' }],
    socials: [
      {
        label: 'Minnesota DoKADs Facebook group',
        href: null,
        note: 'Being set up — link goes here once it exists',
      },
      { label: 'Minnesota email updates', href: null, note: 'Opt in on the join form' },
    ],
    updates: [
      {
        date: '2026-08-01',
        text: 'First coffee meetup penciled in for late September. Date and venue still being settled.',
      },
      {
        date: '2026-07-15',
        text: 'Early survey responses came back. Social meetups, guided discussions, and educational events led the requests.',
      },
    ],
  },
  { slug: 'online', name: 'Online / Global', country: 'Everywhere', status: 'active', intro: 'Everything that does not need a postcode. Most DoKADs live nowhere near another DoKAD, so this is the default home for the community.' },
  { slug: 'us-midwest', name: 'US — Midwest', country: 'United States', status: 'interest' },
  { slug: 'us-west', name: 'US — West', country: 'United States', status: 'interest' },
  { slug: 'us-east', name: 'US — East', country: 'United States', status: 'interest' },
  { slug: 'us-south', name: 'US — South', country: 'United States', status: 'interest' },
  { slug: 'canada', name: 'Canada', country: 'Canada', status: 'interest' },
  { slug: 'france', name: 'France', country: 'France', status: 'interest' },
  { slug: 'denmark', name: 'Denmark', country: 'Denmark', status: 'interest' },
  { slug: 'sweden', name: 'Sweden', country: 'Sweden', status: 'interest' },
  { slug: 'norway', name: 'Norway', country: 'Norway', status: 'interest' },
  { slug: 'netherlands', name: 'Netherlands', country: 'Netherlands', status: 'interest' },
  { slug: 'australia', name: 'Australia', country: 'Australia', status: 'interest' },
  { slug: 'korea', name: 'Korea', country: 'South Korea', status: 'interest' },
]

export const REGION_STATUS_META: Record<
  RegionStatus,
  { label: string; blurb: string; tone: string }
> = {
  active: { label: 'Active', tone: 'green', blurb: 'Running regularly' },
  forming: {
    label: 'Forming',
    tone: 'yellow',
    blurb: 'Organisers on board, first events being planned',
  },
  interest: {
    label: 'Gathering interest',
    tone: 'paper',
    blurb: 'No organisers yet — add your name and we will connect people',
  },
}

export function getRegion(slug: string) {
  return regions.find((r) => r.slug === slug)
}

export const publishedRegions = () => regions.filter((r) => r.status !== 'interest')
export const interestRegions = () => regions.filter((r) => r.status === 'interest')
