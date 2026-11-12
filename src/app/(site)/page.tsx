import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { getPastEvents, getPublishedStories, getUpcomingEvents } from '@/lib/content'
import { copy } from '@/content/copy'

/**
 * Fully static. Content comes from the build-time snapshot, so this page
 * never touches a database at request time — nothing to wake, nothing to pay
 * for, nothing that can be down. See scripts/snapshot.ts.
 */

export const metadata: Metadata = {
  description: copy('home').meta.description,
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
