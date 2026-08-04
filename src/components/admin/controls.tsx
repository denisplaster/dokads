'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionResult } from '@/app/actions/public'

/** A select that fires a server action and refreshes. */
export function StatusSelect({
  value,
  options,
  action,
  label,
}: {
  value: string
  options: readonly string[]
  action: (next: string) => Promise<ActionResult>
  label: string
}) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  return (
    <span className="adm-actions">
      <select
        className="adm-select"
        aria-label={label}
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value
          setError(null)
          start(async () => {
            const res = await action(next)
            if (!res.ok) setError(res.error)
            else router.refresh()
          })
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <span className="adm-error">{error}</span>}
    </span>
  )
}

/**
 * Destructive actions ask first. Deleting personal data is something the
 * site promises to do on request, so it must be easy — but not accidental.
 */
export function ConfirmButton({
  action,
  children,
  confirm,
  danger = true,
}: {
  action: () => Promise<ActionResult>
  children: React.ReactNode
  confirm: string
  danger?: boolean
}) {
  const [pending, start] = useTransition()
  const [armed, setArmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!armed) {
    return (
      <button
        type="button"
        className={`adm-btn ${danger ? 'adm-btn--danger' : 'adm-btn--ghost'}`}
        onClick={() => setArmed(true)}
      >
        {children}
      </button>
    )
  }

  return (
    <span className="adm-actions">
      <span style={{ fontSize: 'var(--t-nano)', maxWidth: '22ch' }}>{confirm}</span>
      <button
        type="button"
        className="adm-btn adm-btn--danger"
        disabled={pending}
        onClick={() => {
          setError(null)
          start(async () => {
            const res = await action()
            if (!res.ok) setError(res.error)
            else router.refresh()
          })
        }}
      >
        {pending ? 'Working…' : 'Yes, do it'}
      </button>
      <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setArmed(false)}>
        Cancel
      </button>
      {error && <span className="adm-error">{error}</span>}
    </span>
  )
}

/** Client-side CSV export. Minors are excluded unless explicitly included. */
export function ExportButton({
  rows,
  filename,
  label = 'Export CSV',
}: {
  rows: Record<string, unknown>[]
  filename: string
  label?: string
}) {
  const [includeMinors, setIncludeMinors] = useState(false)
  const hasMinors = rows.some((r) => r.isMinor === true)

  const download = () => {
    const data = includeMinors ? rows : rows.filter((r) => r.isMinor !== true)
    if (!data.length) return
    const cols = Object.keys(data[0])
    const esc = (v: unknown) => {
      const s = v === null || v === undefined ? '' : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const csv = [cols.join(','), ...data.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <span className="adm-actions">
      <button type="button" className="adm-btn adm-btn--ghost" onClick={download}>
        {label}
      </button>
      {hasMinors && (
        <label className="adm-check" style={{ fontSize: 'var(--t-nano)' }}>
          <input
            type="checkbox"
            checked={includeMinors}
            onChange={(e) => setIncludeMinors(e.target.checked)}
          />
          include under-18s
        </label>
      )}
    </span>
  )
}
