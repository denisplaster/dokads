import type { Metadata } from 'next'
import { Resources } from '@/views/Resources'
import { getPublishedResources } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'A community-built reading pile: books, films, podcasts, organisations, and the practical things nobody hands you.',
}

export default function Page() {
  return <Resources resources={getPublishedResources()} />
}
