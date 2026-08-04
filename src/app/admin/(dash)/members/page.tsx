import { adminListMembers } from '@/db/queries'
import { deleteMember } from '@/app/actions/admin'
import { ConfirmButton, ExportButton } from '@/components/admin/controls'
import { CONNECTION_CHOICES, INTEREST_CHOICES } from '@/data/joinForm'

export const dynamic = 'force-dynamic'

const label = (choices: { value: string; label: string }[]) => {
  const m = new Map(choices.map((c) => [c.value, c.label]))
  return (v: string) => m.get(v) ?? v
}
const connectionLabel = label(CONNECTION_CHOICES)
const interestLabel = label(INTEREST_CHOICES)

export default async function AdminMembers() {
  const rows = await adminListMembers()

  const exportRows = rows.map((r) => ({
    name: r.name,
    email: r.email,
    region: r.regionSlug ?? '',
    ageRange: r.ageRange ?? '',
    isMinor: r.isMinor,
    wantsUpdates: r.wantsUpdates,
    wantsLocal: r.wantsLocal,
    wantsVolunteer: r.wantsVolunteer,
    interests: (r.interests ?? []).join('; '),
    timing: (r.timing ?? []).join('; '),
    venues: (r.venues ?? []).join('; '),
    joined: r.createdAt?.toISOString() ?? '',
  }))

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Members</h1>
          <p>
            People who filled in the join form. Their individual answers never appear publicly —
            use the overview for planning, and this page only when you need to contact someone.
          </p>
        </div>
        <ExportButton rows={exportRows} filename="dokads-members.csv" />
      </div>

      <p className="adm-note">
        <strong>Deletion is a promise.</strong> The site tells people they can reply to any email
        and have everything removed, no reason needed. The delete button here is how that promise
        gets kept — it removes the row outright.
      </p>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Connection</th>
              <th>Wants</th>
              <th>Region / age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="adm-table__main">{r.name}</span>
                  <span className="adm-table__sub">{r.email}</span>
                  {r.isMinor && <span className="adm-minor">under 18</span>}
                </td>
                <td>
                  {(r.connection ?? []).map(connectionLabel).join(', ') || (
                    <span className="adm-redact">not said</span>
                  )}
                </td>
                <td>
                  <span className="adm-table__sub">
                    {(r.interests ?? []).slice(0, 4).map(interestLabel).join(', ')}
                    {(r.interests ?? []).length > 4 && ` +${(r.interests ?? []).length - 4}`}
                  </span>
                  {r.wantsVolunteer && <span className="adm-table__main">Offered to help</span>}
                </td>
                <td>
                  {r.regionSlug ?? <span className="adm-redact">—</span>}
                  <span className="adm-table__sub">{r.ageRange ?? 'age not given'}</span>
                </td>
                <td>
                  <ConfirmButton
                    confirm="Permanently delete this person's data?"
                    action={async () => {
                      'use server'
                      return deleteMember(r.id)
                    }}
                  >
                    Delete
                  </ConfirmButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="adm-empty">Nobody has joined yet.</p>}
      </div>
    </>
  )
}
