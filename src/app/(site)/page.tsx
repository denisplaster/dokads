import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { getPastEvents, getPublishedStories, getUpcomingEvents } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

export const metadata: Metadata = {
  description:
    'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
}

export default function Page() {
  return (
    <Home
      stories={getPublishedStories()}
      upcoming={getUpcomingEvents()}
      past={getPastEvents()}
    />
  )
}
