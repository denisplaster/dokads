import type { Metadata } from 'next'
import { Regions } from '@/views/Regions'

export const metadata: Metadata = {
  title: 'Local groups',
  description:
    'DoKAD communities by region, starting with Minnesota. Korean adoptees were placed across four continents; their descendants are scattered the same way.',
}

export default function Page() {
  return <Regions />
}
