import type { Metadata } from 'next'
import { Resources } from '@/views/Resources'
import { getPublishedResources } from '@/db/queries'
import { toResource } from '@/lib/adapt'

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


export const metadata: Metadata = {
  title: 'Resources',
  description:
    'A community-built reading pile: books, films, podcasts, organisations, and the practical things nobody hands you.',
}

export default async function Page() {
  const resources = await getPublishedResources()
  return <Resources resources={resources.map(toResource)} />
}
