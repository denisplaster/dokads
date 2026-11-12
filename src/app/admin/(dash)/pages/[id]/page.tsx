import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { pageCopy } from '@/db/schema'
import { requireAdmin } from '@/lib/auth-guard'
import { PAGES, isPageId } from '@/content/registry'
import { resolvePage } from '@/content/fields'
import type { PageDef } from '@/content/fields'
import { CopyForm } from '@/components/admin/CopyForm'

export const dynamic = 'force-dynamic'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  if (!isPageId(id)) notFound()
  const def: PageDef = PAGES[id]
  const rows = await db.select().from(pageCopy).where(eq(pageCopy.page, id))
  const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const values = resolvePage(def, overrides) as Record<string, Record<string, unknown>>
  const flat: Record<string, unknown> = {}
  for (const [s, fields] of Object.entries(values)) {
    for (const [f, v] of Object.entries(fields)) flat[`${s}.${f}`] = v
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <p className="adm-crumb">
            <Link href="/admin/pages">Pages</Link> /
          </p>
          <h1>{def.title}</h1>
          {def.help && <p>{def.help}</p>}
        </div>
        {def.path && (
          <a href={def.path} target="_blank" rel="noreferrer" className="adm-btn adm-btn--ghost">
            View the live page ↗
          </a>
        )}
      </div>
      <CopyForm pageId={id} def={def} values={flat} edited={rows.map((r) => r.key)} />
    </>
  )
}
