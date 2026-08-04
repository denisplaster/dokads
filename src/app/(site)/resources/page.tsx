import type { Metadata } from 'next'
import { Resources } from '@/views/Resources'
import { getPublishedResources } from '@/db/queries'
import { toResource } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


export const metadata: Metadata = {
  title: 'Resources',
  description:
    'A community-built reading pile: books, films, podcasts, organisations, and the practical things nobody hands you.',
}

export default async function Page() {
  const resources = await getPublishedResources()
  return <Resources resources={resources.map(toResource)} />
}
