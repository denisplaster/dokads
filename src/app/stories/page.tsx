import type { Metadata } from 'next'
import { Stories } from '@/views/Stories'

export const metadata: Metadata = {
  title: 'Stories',
  description:
    'Essays, interviews, poems, photographs, and open questions from descendants of Korean adoptees.',
}

export default function Page() {
  return <Stories />
}
