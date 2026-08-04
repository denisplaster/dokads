import Link from 'next/link'
import { adminListEvents } from '@/db/queries'
import { STATUS_META, EVENT_TYPES, formatEventDate } from '@/data/events'
import type { EventStatus, EventType } from '@/data/events'
import { setEventStatus, deleteEvent } from '@/app/actions/admin'
import { StatusSelect, ConfirmButton } from '@/components/admin/controls'

export const dynamic = 'force-dynamic'

const STATUSES = Object.keys(STATUS_META) as EventStatus[]

export default async function AdminEvents() {
  const rows = await adminListEvents()

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Events</h1>
          <p>
            Status is the thing people read first on the public site. Nothing shows as confirmed
            until you say so — and anything left as <strong>draft</strong> is invisible, including
            to anyone who guesses the URL.
          </p>
        </div>
        <Link href="/admin/events/new" className="adm-btn">
          New event
        </Link>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>
                  <span className="adm-table__main">{e.title}</span>
                  <span className="adm-table__sub">
                    {EVENT_TYPES[e.type as EventType] ?? e.type} · /{e.slug}
                  </span>
                </td>
                <td>
                  {formatEventDate(e.date)}
                  {e.backupDate && (
                    <span className="adm-table__sub">backup {formatEventDate(e.backupDate)}</span>
                  )}
                </td>
                <td>{e.regionSlug}</td>
                <td>
                  <StatusSelect
                    label={`Status for ${e.title}`}
                    value={e.status}
                    options={STATUSES}
                    action={async (next) => {
                      'use server'
                      return setEventStatus(e.id, next)
                    }}
                  />
                </td>
                <td>
                  <span className="adm-actions">
                    <Link href={`/admin/events/${e.id}`} className="adm-btn adm-btn--ghost">
                      Edit
                    </Link>
                    {e.status !== 'draft' && (
                      <Link href={`/events/${e.slug}`} className="adm-btn adm-btn--ghost">
                        View
                      </Link>
                    )}
                    <ConfirmButton
                      confirm="Delete this event and all its registrations?"
                      action={async () => {
                        'use server'
                        return deleteEvent(e.id)
                      }}
                    >
                      Delete
                    </ConfirmButton>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="adm-empty">No events yet.</p>}
      </div>
    </>
  )
}
