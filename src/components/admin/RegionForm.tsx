'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveRegion } from '@/app/actions/admin'
import type { DbRegion } from '@/db/schema'

type Organiser = { name: string; role: string }
type Social = { label: string; href: string | null; note?: string }

export function RegionForm({ region }: { region?: DbRegion }) {
  const [open, setOpen] = useState(!region)
  const [status, setStatus] = useState(region?.status ?? 'interest')
  const [organisers, setOrganisers] = useState<Organiser[]>(
    region?.organisers?.length ? region.organisers : [{ name: '', role: '' }],
  )
  const [socials, setSocials] = useState<Social[]>(
    region?.socials?.length ? region.socials : [{ label: '', href: null, note: '' }],
  )
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  const realOrganisers = organisers.filter((o) => o.name.trim()).length

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
          const res = await saveRegion({
            slug: String(f.get('slug') ?? ''),
            originalSlug: region?.slug,
            name: String(f.get('name') ?? ''),
            country: String(f.get('country') ?? ''),
            status,
            intro: String(f.get('intro') ?? ''),
            organisers: organisers.filter((o) => o.name.trim()),
            socials: socials
              .filter((s) => s.label.trim())
              .map((s) => ({ ...s, href: s.href?.trim() ? s.href.trim() : null })),
            updates: region?.updates ?? [],
          })
          if (!res.ok) setError(res.error)
          else {
            if (region) setOpen(false)
            router.refresh()
          }
        })
      }}
    >
      <div className="adm-grid-2">
        <div className="adm-field">
          <label>Name</label>
          <input name="name" type="text" required defaultValue={region?.name} />
        </div>
        <div className="adm-field">
          <label>URL slug</label>
          <input name="slug" type="text" required defaultValue={region?.slug} pattern="[a-z0-9\-]+" />
        </div>
        <div className="adm-field">
          <label>Country</label>
          <input name="country" type="text" required defaultValue={region?.country} />
        </div>
        <div className="adm-field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="interest">gathering interest</option>
            <option value="forming">forming</option>
            <option value="active">active</option>
          </select>
          <span className="adm-field__help">
            Only non-interest regions get a public page — and only with an organiser.
          </span>
        </div>
      </div>

      <div className="adm-field">
        <label>Intro</label>
        <textarea name="intro" defaultValue={region?.intro ?? ''} style={{ minHeight: '5rem' }} />
      </div>

      <fieldset className="adm-field" style={{ border: 0, padding: 0 }}>
        <legend style={{ fontSize: 'var(--t-micro)', fontWeight: 800, textTransform: 'uppercase' }}>
          Organisers
        </legend>
        <div className="adm-repeat">
          {organisers.map((o, i) => (
            <div className="adm-repeat__row" key={i}>
              <input
                type="text"
                placeholder="Name"
                value={o.name}
                onChange={(e) =>
                  setOrganisers((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                }
              />
              <input
                type="text"
                placeholder="Role"
                value={o.role}
                onChange={(e) =>
                  setOrganisers((p) => p.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))
                }
              />
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={() => setOrganisers((p) => p.filter((_, j) => j !== i))}
              >
                −
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          style={{ justifySelf: 'start' }}
          onClick={() => setOrganisers((p) => [...p, { name: '', role: '' }])}
        >
          Add organiser
        </button>
        {status !== 'interest' && realOrganisers === 0 && (
          <span className="adm-field__help" style={{ color: 'var(--red-text)' }}>
            This region cannot be published without at least one organiser.
          </span>
        )}
      </fieldset>

      <fieldset className="adm-field" style={{ border: 0, padding: 0 }}>
        <legend style={{ fontSize: 'var(--t-micro)', fontWeight: 800, textTransform: 'uppercase' }}>
          Social links
        </legend>
        <div className="adm-repeat">
          {socials.map((s, i) => (
            <div className="adm-repeat__row" key={i}>
              <input
                type="text"
                placeholder="Label"
                value={s.label}
                onChange={(e) =>
                  setSocials((p) => p.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                }
              />
              <input
                type="text"
                placeholder="https://  (blank = coming soon)"
                value={s.href ?? ''}
                onChange={(e) =>
                  setSocials((p) => p.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))
                }
              />
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={() => setSocials((p) => p.filter((_, j) => j !== i))}
              >
                −
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          style={{ justifySelf: 'start' }}
          onClick={() => setSocials((p) => [...p, { label: '', href: null, note: '' }])}
        >
          Add link
        </button>
      </fieldset>

      {error && <p className="adm-error">{error}</p>}
      <div className="adm-actions">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save region'}
        </button>
        {region && (
          <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setOpen(false)}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
