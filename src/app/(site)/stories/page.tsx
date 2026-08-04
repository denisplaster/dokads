import type { Metadata } from 'next'
import { Stories } from '@/views/Stories'
import { getPublishedStories } from '@/db/queries'
import { toStory } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


export const metadata: Metadata = {
  title: 'Stories',
  description:
    'Essays, interviews, poems, photographs, and open questions from descendants of Korean adoptees.',
}

export default async function Page() {
  const stories = await getPublishedStories()
  return <Stories stories={stories.map(toStory)} />
}
