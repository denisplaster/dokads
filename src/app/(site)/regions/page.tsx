import type { Metadata } from 'next'
import { Regions } from '@/views/Regions'
import { getAllRegions, getRegionEventCounts } from '@/db/queries'
import { toRegion } from '@/lib/adapt'

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
  title: 'Local groups',
  description:
    'DoKAD communities by region, starting with Minnesota. Korean adoptees were placed across four continents; their descendants are scattered the same way.',
}

export default async function Page() {
  const [regions, eventCounts] = await Promise.all([getAllRegions(), getRegionEventCounts()])
  return <Regions regions={regions.map(toRegion)} eventCounts={eventCounts} />
}
