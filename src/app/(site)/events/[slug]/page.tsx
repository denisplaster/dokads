import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EventPage } from '@/views/EventPage'
import { STATUS_META, formatEventDate } from '@/data/events'
import type { EventStatus } from '@/data/events'
import { getEventBySlug, getPublicEvents, getPublishedRegion } from '@/db/queries'
import { toEvent, toRegion } from '@/lib/adapt'

/**
 * Content comes from the database, so these pages are ISR rather than baked
 * at build time. Admin writes call revalidatePath, which makes an edit appear
 * immediately; the hourly window is only a backstop.
 */
export const revalidate = 3600


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
  const row = await getEventBySlug(slug)
  if (!row) return { title: 'Event not found' }
  // the status belongs in the link preview too — a shared link must not
  // imply an event is confirmed when it is not
  const status = STATUS_META[row.status as EventStatus].label
  return {
    title: `${row.title} — ${status}`,
    description: `${formatEventDate(row.date, { long: true })} · ${row.location}. ${row.blurb}`,
    openGraph: {
      title: row.title,
      description: `${status} · ${formatEventDate(row.date, { long: true })} · ${row.location}`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await getEventBySlug(slug)
  // drafts are admin-only; they must not be reachable by guessing the URL
  if (!row || row.status === 'draft') notFound()
  const region = await getPublishedRegion(row.regionSlug)
  return <EventPage event={toEvent(row)} region={region ? toRegion(region) : undefined} />
}
