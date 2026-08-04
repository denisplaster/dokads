import type { Metadata } from 'next'
import { Join } from '@/views/Join'

export const metadata: Metadata = {
  title: 'Join DOKADS',
  description:
    'A few quick questions — nothing too personal. Share only what feels comfortable.',
}

export default function Page() {
  return <Join />
}
