import type { Metadata } from 'next'
import { AmIaDokad } from '@/views/AmIaDokad'

export const metadata: Metadata = {
  title: 'Am I a DoKAD?',
  description:
    'A DoKAD is a descendant of a Korean adoptee. If your parent or grandparent was adopted from Korea, that is you. No test to pass.',
}

export default function Page() {
  return <AmIaDokad />
}
