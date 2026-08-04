import type { Metadata } from 'next'
import { Learn } from '@/views/Learn'

export const metadata: Metadata = {
  title: 'The big questions',
  description:
    'Who DoKADs are, what Korean adoption was, where the community is, and why any of it matters for the second generation.',
}

export default function Page() {
  return <Learn />
}
