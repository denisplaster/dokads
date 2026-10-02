import type { Metadata } from 'next'
import { Stories } from '@/views/Stories'
import { getPublishedStories } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

export const metadata: Metadata = {
  title: 'Stories',
  description:
    'Essays, interviews, poems, photographs, and open questions from descendants of Korean adoptees.',
}

export default function Page() {
  return <Stories stories={getPublishedStories()} />
}
