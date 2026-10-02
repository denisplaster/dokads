import type { Metadata } from 'next'
import { Regions } from '@/views/Regions'
import { getAllRegions, getRegionEventCounts } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

export const metadata: Metadata = {
  title: 'Local groups',
  description:
    'DoKAD communities by region, starting with Minnesota. Korean adoptees were placed across four continents; their descendants are scattered the same way.',
}

export default function Page() {
  return <Regions regions={getAllRegions()} eventCounts={getRegionEventCounts()} />
}
