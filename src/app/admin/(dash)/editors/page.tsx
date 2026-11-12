import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { user } from '@/db/schema'
import { requireAdmin } from '@/lib/auth-guard'
import { removeEditor } from '@/app/actions/cms'
import { ConfirmButton } from '@/components/admin/controls'
import { AddEditorForm, PasswordLinkButton } from '@/components/admin/EditorControls'

export const dynamic = 'force-dynamic'

export default async function Editors() {
  const me = await requireAdmin()
  const people = await db.select().from(user).orderBy(asc(user.createdAt))

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Editors</h1>
          <p>
            Everyone who can sign in here. Every editor can change all of the site’s content,
            publish it, and add or remove other editors.
          </p>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Since</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="adm-table__main">
                    {p.name}
                    {p.id === me.id ? ' (you)' : ''}
                  </span>
                  <span className="adm-table__sub">{p.email}</span>
                  {p.role !== 'admin' && (
                    <span className="adm-table__sub">regional organiser · {p.regionSlug ?? 'no region'}</span>
                  )}
                </td>
                <td>
                  {p.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td>
                  <span className="adm-actions">
                    <PasswordLinkButton userId={p.id} email={p.email} />
                    {p.id !== me.id && (
                      <ConfirmButton
                        confirm={`Remove ${p.name}? They are signed out at once.`}
                        action={async () => {
                          'use server'
                          return removeEditor(p.id)
                        }}
                      >
                        Remove
                      </ConfirmButton>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="adm-card" style={{ marginTop: 'var(--s-6)' }}>
        <h2>Add an editor</h2>
        <p className="adm-field__help" style={{ marginBottom: 'var(--s-4)' }}>
          You get a one-time link to send them. They open it, choose their own password, and
          sign in at /admin. Nobody else ever sees their password — including you.
        </p>
        <AddEditorForm />
      </section>
    </>
  )
}
