import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { getPublicEvents, getPublishedStories } from '@/db/queries'
import { toEvent, toStory } from '@/lib/adapt'

/**
 * Rendered per request, not at build time.
 *
 * These pages read from Postgres. Prerendering them coupled every deploy to
 * the database being reachable AND migrated — a first deploy, a paused Neon
 * branch, or a transient outage failed the build outright. A build should
 * never depend on a database it does not own.
 *
 * Still server-rendered HTML, so nothing is lost for search engines or link
 * previews, and CMS edits appear immediately with no revalidation to reason
 * about. If traffic ever justifies caching, add it here deliberately.
 */
export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  description:
    'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
}

export default async function Page() {
  const [stories, events] = await Promise.all([getPublishedStories(), getPublicEvents()])
  return <Home stories={stories.map(toStory)} events={events.map(toEvent)} />
}
