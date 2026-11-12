import Link from 'next/link'
import type { Route } from 'next'
import { count } from 'drizzle-orm'
import { db } from '@/db'
import { pageCopy } from '@/db/schema'
import { requireAdmin } from '@/lib/auth-guard'
import { PAGES } from '@/content/registry'
import type { PageDef } from '@/content/fields'

export const dynamic = 'force-dynamic'

export default async function AdminPages() {
  await requireAdmin()
  const rows = await db
    .select({ page: pageCopy.page, n: count() })
    .from(pageCopy)
    .groupBy(pageCopy.page)
  const edited = new Map(rows.map((r) => [r.page, r.n]))

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Pages</h1>
          <p>
            All the wording on the site that is not an event, story, resource or local group:
            headlines, introductions, buttons, notes, menus and the footer. Every field starts
            with the text the site launched with, and can be reset to it.
          </p>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Where it shows</th>
              <th>Your changes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(Object.values(PAGES) as PageDef[]).map((p) => {
              const n = edited.get(p.id) ?? 0
              return (
                <tr key={p.id}>
                  <td>
                    <span className="adm-table__main">{p.title}</span>
                    {p.help && <span className="adm-table__sub">{p.help}</span>}
                  </td>
                  <td>{p.path ?? 'Several pages'}</td>
                  <td>{n ? `${n} changed` : '—'}</td>
                  <td>
                    <Link href={`/admin/pages/${p.id}` as Route} className="adm-btn adm-btn--ghost">
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
