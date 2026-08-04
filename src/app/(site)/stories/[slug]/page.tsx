import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StoryPage } from '@/views/StoryPage'
import { STORY_KINDS } from '@/data/stories'
import type { StoryKind } from '@/data/stories'
import { getPublishedStories, getRelatedStories, getStoryBySlug } from '@/db/queries'
import { toStory } from '@/lib/adapt'

/**
 * Rendered per request, not at build time.
 *
 * These pages read from Postgres. Prerendering them coupled every deploy to
 * the database being reachable AND migrated — a first deploy, a paused Neon
 * branch, or a transient outage failed the build outright. A build should
 * never depend on a database it does not own.
 *
 * Still server-rendered HTML, so nothing is lost for search engines or link
 * previews, and CMS edits appear immediately with no revalidation to reason
 * about. If traffic ever justifies caching, add it here deliberately.
 */
export const dynamic = 'force-dynamic'


/**
 * No generateStaticParams on purpose. Content is CMS-driven, so a page created
 * in the admin must get a URL without a redeploy — these render on first
 * request and are then ISR-cached. It also means a build needs no database.
 */

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
