import type { Metadata } from 'next'
import { Regions } from '@/views/Regions'
import { getAllRegions, getRegionEventCounts } from '@/db/queries'
import { toRegion } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


export const metadata: Metadata = {
  title: 'Local groups',
  description:
    'DoKAD communities by region, starting with Minnesota. Korean adoptees were placed across four continents; their descendants are scattered the same way.',
}

export default async function Page() {
  const [regions, eventCounts] = await Promise.all([getAllRegions(), getRegionEventCounts()])
  return <Regions regions={regions.map(toRegion)} eventCounts={eventCounts} />
}
