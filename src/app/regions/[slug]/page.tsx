import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RegionPage } from '@/views/RegionPage'
import { REGION_STATUS_META } from '@/data/regions'
import type { RegionStatus } from '@/data/regions'
import { getAllRegions, getEventsInRegion, getPublishedRegion } from '@/db/queries'
import { toEvent, toRegion } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


/** Only regions with real organisers get a page — see data/regions.ts. */
export async function generateStaticParams() {
  const rows = await getAllRegions()
  return rows.filter((r) => r.status !== 'interest').map((r) => ({ slug: r.slug }))
}

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
