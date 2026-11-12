import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Events } from '@/views/Events'
import { getAllRegions, getPastEvents, getUpcomingEvents } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

const meta = copy('events').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return (
    <Events
      upcoming={getUpcomingEvents()}
      past={getPastEvents()}
      regions={getAllRegions()}
      text={copy('events')}
    />
  )
}
