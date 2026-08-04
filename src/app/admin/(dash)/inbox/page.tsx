import { adminListSubmissions } from '@/db/queries'
import { deleteSubmission, setSubmissionStatus } from '@/app/actions/admin'
import { ConfirmButton, StatusSelect } from '@/components/admin/controls'

export const dynamic = 'force-dynamic'

const SUB_STATUSES = ['new', 'read', 'actioned', 'archived'] as const
const KIND_LABEL: Record<string, string> = {
  resource: 'Resource suggestion',
  story: 'Story pitch',
  contact: 'Message',
}

export default async function AdminInbox() {
  const rows = await adminListSubmissions()

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Inbox</h1>
          <p>Resource suggestions, story pitches, and anything else people send.</p>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Kind</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>
                  <span className="adm-table__main">{s.name ?? 'Anonymous'}</span>
                  {s.email && <span className="adm-table__sub">{s.email}</span>}
                </td>
                <td>{KIND_LABEL[s.kind] ?? s.kind}</td>
                <td style={{ maxWidth: '38ch' }}>
                  <span className="adm-table__main">{s.subject}</span>
                  <span className="adm-table__sub">{s.message}</span>
                </td>
                <td>
                  <StatusSelect
                    label={`Status for ${s.subject}`}
                    value={s.status}
                    options={SUB_STATUSES}
                    action={async (next) => {
                      'use server'
                      return setSubmissionStatus(s.id, next)
                    }}
                  />
                </td>
                <td>
                  <ConfirmButton
                    confirm="Delete this submission?"
                    action={async () => {
                      'use server'
                      return deleteSubmission(s.id)
                    }}
                  >
                    Delete
                  </ConfirmButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="adm-empty">Nothing in the inbox.</p>}
      </div>
    </>
  )
}
