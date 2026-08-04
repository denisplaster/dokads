import type { Metadata } from 'next'
import { Share } from '@/views/Share'

export const metadata: Metadata = {
  title: 'Share DOKADS',
  description:
    'Copy you can send, graphics you can post, and a flyer you can print. An invitation, not an assignment.',
}

export default function Page() {
  return <Share />
}
