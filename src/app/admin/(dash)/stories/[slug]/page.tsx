import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { stories } from '@/db/schema'
import { StoryForm } from '@/components/admin/StoryForm'

export const dynamic = 'force-dynamic'

export default async function EditStory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [story] = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1)
  if (!story) notFound()

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{story.title}</h1>
        </div>
        <Link href="/admin/stories" className="adm-btn adm-btn--ghost">
          Back to stories
        </Link>
      </div>
      <div className="adm-card">
        <StoryForm story={story} />
      </div>
    </>
  )
}
