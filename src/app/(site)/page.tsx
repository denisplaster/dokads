import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { getPublicEvents, getPublishedStories } from '@/db/queries'
import { toEvent, toStory } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


export const metadata: Metadata = {
  description:
    'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
}

export default async function Page() {
  const [stories, events] = await Promise.all([getPublishedStories(), getPublicEvents()])
  return <Home stories={stories.map(toStory)} events={events.map(toEvent)} />
}
