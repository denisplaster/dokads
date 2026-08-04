import type { Metadata } from 'next'
import { StoryPage } from '@/views/StoryPage'
import { STORY_KINDS, getStory, stories } from '@/data/stories'

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = getStory(slug)
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
  return <StoryPage slug={slug} />
}
