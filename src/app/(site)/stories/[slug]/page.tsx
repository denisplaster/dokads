import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StoryPage } from '@/views/StoryPage'
import { STORY_KINDS } from '@/data/stories'
import { getPublishedStories, getRelatedStories, getStoryBySlug } from '@/lib/content'

/**
 * Fully static, prerendered at build time — content comes from src/data, so
 * every story URL can be enumerated without a database. See lib/site-mode.ts.
 */
export function generateStaticParams() {
  return getPublishedStories().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) return { title: 'Story not found' }
  return {
    title: story.title,
    description: story.dek,
    openGraph: {
      title: story.title,
      description: story.dek,
      type: 'article',
      authors: [story.byline],
    },
    other: { 'article:section': STORY_KINDS[story.kind].label },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) notFound()
  return <StoryPage story={story} related={getRelatedStories(slug)} />
}
