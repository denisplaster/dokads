import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StoryPage } from '@/views/StoryPage'
import { STORY_KINDS } from '@/data/stories'
import type { StoryKind } from '@/data/stories'
import { getPublishedStories, getRelatedStories, getStoryBySlug } from '@/db/queries'
import { toStory } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


export async function generateStaticParams() {
  const rows = await getPublishedStories()
  return rows.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const row = await getStoryBySlug(slug)
  if (!row) return { title: 'Story not found' }
  return {
    title: row.title,
    description: row.dek,
    openGraph: {
      title: row.title,
      description: row.dek,
      type: 'article',
      authors: [row.byline],
    },
    other: { 'article:section': STORY_KINDS[row.kind as StoryKind].label },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await getStoryBySlug(slug)
  if (!row) notFound()
  const related = await getRelatedStories(slug)
  return <StoryPage story={toStory(row)} related={related.map(toStory)} />
}
