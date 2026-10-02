import type { Metadata } from 'next'
import { Events } from '@/views/Events'
import { getAllRegions, getPublicEvents } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Coffee meetups, online gatherings, and guided conversations for descendants of Korean adoptees. Mostly free, mostly informal.',
}

export default function Page() {
  return <Events events={getPublicEvents()} regions={getAllRegions()} />
}
