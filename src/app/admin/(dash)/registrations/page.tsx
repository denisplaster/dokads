import Link from 'next/link'
import { adminListRegistrations } from '@/db/queries'
import { deleteRegistration, setRegistrationStatus } from '@/app/actions/admin'
import { ConfirmButton, ExportButton, StatusSelect } from '@/components/admin/controls'

export const dynamic = 'force-dynamic'

const REG_STATUSES = ['registered', 'waitlist', 'cancelled', 'attended'] as const

export default async function AdminRegistrations() {
  const rows = await adminListRegistrations()

  const exportRows = rows.map(({ reg, eventTitle }) => ({
    event: eventTitle,
    firstName: reg.firstName,
    lastName: reg.lastName ?? '',
    email: reg.email,
    status: reg.status,
    ageRange: reg.ageRange ?? '',
    isMinor: reg.isMinor,
    city: reg.city ?? '',
    accessibility: reg.accessibility ?? '',
    dietary: reg.dietary ?? '',
    registered: reg.createdAt?.toISOString() ?? '',
  }))

  const withAccess = rows.filter((r) => r.reg.accessibility)

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Registrations</h1>
          <p>Everyone signed up across all events.</p>
        </div>
        <ExportButton rows={exportRows} filename="dokads-registrations.csv" />
      </div>

      {withAccess.length > 0 && (
        <p className="adm-note">
          <strong>
            {withAccess.length} accommodation request{withAccess.length === 1 ? '' : 's'}.
          </strong>{' '}
          Read these before the event, not on the day.
        </p>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Event</th>
              <th>Needs</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ reg, eventTitle, eventSlug }) => (
              <tr key={reg.id}>
                <td>
                  <span className="adm-table__main">
                    {reg.firstName} {reg.lastName ?? ''}
                  </span>
                  <span className="adm-table__sub">{reg.email}</span>
                  {reg.isMinor && <span className="adm-minor">under 18</span>}
                </td>
                <td>
                  <Link href={`/events/${eventSlug}`}>{eventTitle}</Link>
                  <span className="adm-table__sub">{reg.city ?? ''}</span>
                </td>
                <td>
                  {reg.accessibility && (
                    <span className="adm-table__main">{reg.accessibility}</span>
                  )}
                  {reg.dietary && <span className="adm-table__sub">Diet: {reg.dietary}</span>}
                  {!reg.accessibility && !reg.dietary && <span className="adm-redact">—</span>}
                </td>
                <td>
                  <StatusSelect
                    label={`Status for ${reg.firstName}`}
                    value={reg.status}
                    options={REG_STATUSES}
                    action={async (next) => {
                      'use server'
                      return setRegistrationStatus(reg.id, next)
                    }}
                  />
                </td>
                <td>
                  <ConfirmButton
                    confirm="Delete this registration?"
                    action={async () => {
                      'use server'
                      return deleteRegistration(reg.id)
                    }}
                  >
                    Delete
                  </ConfirmButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="adm-empty">No registrations yet.</p>}
      </div>
    </>
  )
}
