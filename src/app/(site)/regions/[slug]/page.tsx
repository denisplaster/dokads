import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RegionPage } from '@/views/RegionPage'
import { vocab } from '@/content/vocab'
import { copy } from '@/content/copy'
import { getAllRegions, getEventsInRegion, getPublishedRegion } from '@/lib/content'

/**
 * Fully static. A region only gets a page once real organisers exist, so
 * interest-only regions are never enumerated.
 */
export function generateStaticParams() {
  return getAllRegions()
    .filter((r) => r.status !== 'interest')
    .map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const region = getPublishedRegion(slug)
  if (!region) return { title: 'Region not found' }
  return {
    title: region.name,
    description:
      region.intro ??
      `${region.name} — ${vocab.regionStatus(region.status).blurb}. ${copy('regions').meta.regionSuffix}`,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const region = getPublishedRegion(slug)
  if (!region) notFound()
  return <RegionPage region={region} events={getEventsInRegion(slug)} />
}
