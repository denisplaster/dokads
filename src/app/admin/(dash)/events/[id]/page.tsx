import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { events } from '@/db/schema'
import { getAllRegions, adminListRegistrations } from '@/db/queries'
import { EventForm } from '@/components/admin/EventForm'

export const dynamic = 'force-dynamic'

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1)
  if (!event) notFound()
  const [regions, regs] = await Promise.all([getAllRegions(), adminListRegistrations(id)])

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{event.title}</h1>
          <p>
            {regs.length} registration{regs.length === 1 ? '' : 's'}.{' '}
            <Link href="/admin/registrations">See them all</Link>.
          </p>
        </div>
        <Link href="/admin/events" className="adm-btn adm-btn--ghost">
          Back to events
        </Link>
      </div>
      <div className="adm-card">
        <EventForm event={event} regions={regions.map((r) => ({ slug: r.slug, name: r.name }))} />
      </div>
    </>
  )
}
