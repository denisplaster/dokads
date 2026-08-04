import { getAllRegions } from '@/db/queries'
import { EventForm } from '@/components/admin/EventForm'

export const dynamic = 'force-dynamic'

export default async function NewEvent() {
  const regions = await getAllRegions()
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>New event</h1>
          <p>Starts as a draft. Nothing appears publicly until you change the status.</p>
        </div>
      </div>
      <div className="adm-card">
        <EventForm regions={regions.map((r) => ({ slug: r.slug, name: r.name }))} />
      </div>
    </>
  )
}
