import type { Metadata } from 'next'
import { Events } from '@/views/Events'
import { getAllRegions, getPublicEvents } from '@/db/queries'
import { toEvent, toRegion } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


export const metadata: Metadata = {
  title: 'Events',
  description:
    'Coffee meetups, online gatherings, and guided conversations for descendants of Korean adoptees. Mostly free, mostly informal.',
}

export default async function Page() {
  const [events, regions] = await Promise.all([getPublicEvents(), getAllRegions()])
  return <Events events={events.map(toEvent)} regions={regions.map(toRegion)} />
}
