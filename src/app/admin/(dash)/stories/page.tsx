import Link from 'next/link'
import { adminListStories } from '@/db/queries'
import { deleteStory } from '@/app/actions/admin'
import { ConfirmButton } from '@/components/admin/controls'
import { STORY_KINDS } from '@/data/stories'
import type { StoryKind } from '@/data/stories'

export const dynamic = 'force-dynamic'

export default async function AdminStories() {
  const rows = await adminListStories()
  const placeholders = rows.filter((r) => r.isPlaceholder).length

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Stories</h1>
          <p>Essays, interviews, poems, photo stories, and community questions.</p>
        </div>
        <Link href="/admin/stories/new" className="adm-btn">
          New story
        </Link>
      </div>

      {placeholders > 0 && (
        <p className="adm-note">
          <strong>{placeholders} of {rows.length} pieces are placeholder layout copy.</strong> They
          render with a visible flag saying so. Replace them with real submissions and untick the
          placeholder box as Issue 001 comes together.
        </p>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Format</th>
              <th>Byline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.slug}>
                <td>
                  <span className="adm-table__main">{s.title}</span>
                  <span className="adm-table__sub">/{s.slug}</span>
                </td>
                <td>{STORY_KINDS[s.kind as StoryKind]?.label ?? s.kind}</td>
                <td>
                  {s.byline}
                  <span className="adm-table__sub">as {s.bylineStyle}</span>
                </td>
                <td>
                  {s.status}
                  {s.isPlaceholder && <span className="adm-table__sub">placeholder</span>}
                  {s.featured && <span className="adm-table__sub">featured</span>}
                </td>
                <td>
                  <span className="adm-actions">
                    <Link href={`/admin/stories/${s.slug}`} className="adm-btn adm-btn--ghost">
                      Edit
                    </Link>
                    <ConfirmButton
                      confirm="Delete this story?"
                      action={async () => {
                        'use server'
                        return deleteStory(s.slug)
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
        {rows.length === 0 && <p className="adm-empty">No stories yet.</p>}
      </div>
    </>
  )
}
