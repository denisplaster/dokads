import type { Metadata } from 'next'
import { About } from '@/views/About'

export const metadata: Metadata = {
  title: 'About',
  description:
    'DOKADS is community-led: DoKAD programming should be shaped and led by DoKADs.',
}

export default function Page() {
  return <About />
}
