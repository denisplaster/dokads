'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveResource } from '@/app/actions/admin'
import { AUDIENCES, FORMATS } from '@/data/resources'
import type { DbResource } from '@/db/schema'

const FORMAT_KEYS = Object.keys(FORMATS)
const AUDIENCE_KEYS = Object.keys(AUDIENCES)
const CARDS = ['index', 'sticky', 'bookmark', 'library', 'clipping']

export function ResourceEditor({ resource }: { resource?: DbResource }) {
  const [open, setOpen] = useState(!resource)
  const [audience, setAudience] = useState<string[]>(resource?.audience ?? ['everyone'])
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  if (!open) {
    return (
      <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setOpen(true)}>
        Edit
      </button>
    )
  }

  return (
    <form
      className="adm-form"
      style={{ marginTop: 'var(--s-3)' }}
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        setError(null)
        start(async () => {
          const res = await saveResource({
            id: resource?.id,
            title: String(f.get('title') ?? ''),
            blurb: String(f.get('blurb') ?? ''),
            format: String(f.get('format') ?? 'read'),
            audience,
            badge: String(f.get('badge') ?? ''),
            card: String(f.get('card') ?? 'index'),
            link: String(f.get('link') ?? ''),
            published: f.get('published') === 'on',
            sortOrder: String(f.get('sortOrder') ?? '100'),
          })
          if (!res.ok) setError(res.error)
          else {
            setOpen(!!resource ? false : true)
            router.refresh()
          }
        })
      }}
    >
      <div className="adm-grid-2">
        <div className="adm-field">
          <label>Title</label>
          <input name="title" type="text" required defaultValue={resource?.title} />
        </div>
        <div className="adm-field">
          <label>Format</label>
          <select name="format" defaultValue={resource?.format ?? 'read'}>
            {FORMAT_KEYS.map((k) => (
              <option key={k} value={k}>
                {FORMATS[k as keyof typeof FORMATS].verb}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="adm-field">
        <label>Blurb</label>
        <textarea name="blurb" defaultValue={resource?.blurb} style={{ minHeight: '4rem' }} />
      </div>
      <div className="adm-grid-2">
        <div className="adm-field">
          <label>Link</label>
          <input name="link" type="url" defaultValue={resource?.link ?? ''} placeholder="https://" />
          <span className="adm-field__help">
            Leave blank while the shelf is still an open call.
          </span>
        </div>
        <div className="adm-field">
          <label>Badge</label>
          <input name="badge" type="text" defaultValue={resource?.badge ?? ''} placeholder="Start here" />
        </div>
        <div className="adm-field">
          <label>Card style</label>
          <select name="card" defaultValue={resource?.card ?? 'index'}>
            {CARDS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label>Sort order</label>
          <input name="sortOrder" type="number" defaultValue={resource?.sortOrder ?? 100} />
        </div>
      </div>
      <fieldset className="adm-field" style={{ border: 0, padding: 0 }}>
        <legend style={{ fontSize: 'var(--t-micro)', fontWeight: 800, textTransform: 'uppercase' }}>
          Who it is for
        </legend>
        <div className="adm-grid-2">
          {AUDIENCE_KEYS.map((a) => (
            <label className="adm-check" key={a}>
              <input
                type="checkbox"
                checked={audience.includes(a)}
                onChange={(e) =>
                  setAudience((prev) =>
                    e.target.checked ? [...prev, a] : prev.filter((x) => x !== a),
                  )
                }
              />
              {AUDIENCES[a as keyof typeof AUDIENCES]}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="adm-check">
        <input type="checkbox" name="published" defaultChecked={resource?.published ?? true} />
        Visible on the public site
      </label>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-actions">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
        {resource && (
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setOpen(false)}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
