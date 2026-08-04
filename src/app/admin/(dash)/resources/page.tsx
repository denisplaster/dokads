import { adminListResources } from '@/db/queries'
import { deleteResource } from '@/app/actions/admin'
import { ConfirmButton } from '@/components/admin/controls'
import { ResourceEditor } from '@/components/admin/ResourceRow'
import { FORMATS } from '@/data/resources'
import type { ResourceFormat } from '@/data/resources'

export const dynamic = 'force-dynamic'

export default async function AdminResources() {
  const rows = await adminListResources()
  const openCalls = rows.filter((r) => !r.link).length

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Resources</h1>
          <p>Shelves the community fills in. A shelf without a link is an open call.</p>
        </div>
      </div>

      {openCalls > 0 && (
        <p className="adm-note">
          <strong>{openCalls} shelves have no link yet.</strong> That is by design — we would
          rather show honest empty shelves than pad the list. Fill them in as real
          recommendations come through the inbox.
        </p>
      )}

      <div className="adm-card">
        <h2>Add a resource</h2>
        <ResourceEditor />
      </div>

      {rows.map((r) => (
        <div className="adm-card" key={r.id}>
          <div className="adm-head" style={{ marginBottom: 'var(--s-2)', paddingBottom: 0, borderBottom: 0 }}>
            <div>
              <strong>{r.title}</strong>
              <span className="adm-table__sub">
                {FORMATS[r.format as ResourceFormat]?.verb ?? r.format}
                {r.link ? ' · linked' : ' · open call'}
                {!r.published && ' · hidden'}
              </span>
            </div>
            <span className="adm-actions">
              <ResourceEditor resource={r} />
              <ConfirmButton
                confirm="Delete this resource?"
                action={async () => {
                  'use server'
                  return deleteResource(r.id)
                }}
              >
                Delete
              </ConfirmButton>
            </span>
          </div>
          <p className="adm-field__help">{r.blurb}</p>
        </div>
      ))}
    </>
  )
}
