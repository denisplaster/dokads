import type { Metadata } from 'next'
import { EventPage } from '@/views/EventPage'
import { STATUS_META, events, formatEventDate, getEvent } from '@/data/events'

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) return { title: 'Event not found' }
  // the status belongs in the link preview too — a shared link should not
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
  return <EventPage slug={slug} />
}
