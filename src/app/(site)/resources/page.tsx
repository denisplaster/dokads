import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Resources } from '@/views/Resources'
import { getPublishedResources } from '@/lib/content'

/**
 * Fully static. Content comes from the committed modules in src/data, so this
 * page needs no database at build time or at request time — nothing to wake,
 * nothing to pay for, nothing that can be down. See src/lib/site-mode.ts.
 */

const meta = copy('resources').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <Resources resources={getPublishedResources()} text={copy('resources')} />
}
