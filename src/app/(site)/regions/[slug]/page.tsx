import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RegionPage } from '@/views/RegionPage'
import { REGION_STATUS_META } from '@/data/regions'
import type { RegionStatus } from '@/data/regions'
import { getAllRegions, getEventsInRegion, getPublishedRegion } from '@/db/queries'
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


/**
 * No generateStaticParams on purpose. Content is CMS-driven, so a page created
 * in the admin must get a URL without a redeploy — these render on first
 * request and are then ISR-cached. It also means a build needs no database.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const row = await getPublishedRegion(slug)
  if (!row) return { title: 'Region not found' }
  return {
    title: row.name,
    description:
      row.intro ??
      `${row.name} — ${REGION_STATUS_META[row.status as RegionStatus].blurb}. A DoKAD community for descendants of Korean adoptees.`,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await getPublishedRegion(slug)
  if (!row) notFound()
  const events = await getEventsInRegion(slug)
  return <RegionPage region={toRegion(row)} events={events.map(toEvent)} />
}
