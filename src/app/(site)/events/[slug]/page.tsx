import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EventPage } from '@/views/EventPage'
import { STATUS_META, formatEventDate } from '@/data/events'
import { getEventBySlug, getPublicEvents, getPublishedRegion } from '@/lib/content'

/**
 * Fully static. Only non-draft events are enumerated, so a draft has no page
 * to find — the same rule the database queries enforced.
 */
export function generateStaticParams() {
  return getPublicEvents().map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) return { title: 'Event not found' }
  // the status belongs in the link preview too — a shared link must not
  // imply an event is confirmed when it is not
  const status = STATUS_META[event.status].label
  return {
    title: `${event.title} — ${status}`,
    description: `${formatEventDate(event.date, { long: true })} · ${event.location}. ${event.blurb}`,
    openGraph: {
      title: event.title,
      description: `${status} · ${formatEventDate(event.date, { long: true })} · ${event.location}`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) notFound()
  return <EventPage event={event} region={getPublishedRegion(event.region)} />
}
