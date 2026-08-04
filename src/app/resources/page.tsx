import type { Metadata } from 'next'
import { Resources } from '@/views/Resources'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'A community-built reading pile: books, films, podcasts, organisations, and the practical things nobody hands you.',
}

export default function Page() {
  return <Resources />
}
