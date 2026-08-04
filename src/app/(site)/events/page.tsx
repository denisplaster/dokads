import type { Metadata } from 'next'
import { Events } from '@/views/Events'
import { getAllRegions, getPublicEvents } from '@/db/queries'
import { toEvent, toRegion } from '@/lib/adapt'

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
  title: 'Events',
  description:
    'Coffee meetups, online gatherings, and guided conversations for descendants of Korean adoptees. Mostly free, mostly informal.',
}

export default async function Page() {
  const [events, regions] = await Promise.all([getPublicEvents(), getAllRegions()])
  return <Events events={events.map(toEvent)} regions={regions.map(toRegion)} />
}
