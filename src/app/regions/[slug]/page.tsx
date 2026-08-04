import type { Metadata } from 'next'
import { RegionPage } from '@/views/RegionPage'
import { REGION_STATUS_META, getRegion, publishedRegions } from '@/data/regions'

/** Only regions with real organisers get a page — see data/regions.ts. */
export function generateStaticParams() {
  return publishedRegions().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const region = getRegion(slug)
  if (!region || region.status === 'interest') return { title: 'Region not found' }
  return {
    title: region.name,
    description:
      region.intro ??
      `${region.name} — ${REGION_STATUS_META[region.status].blurb}. A DoKAD community for descendants of Korean adoptees.`,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <RegionPage slug={slug} />
}
