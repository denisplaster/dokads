'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addEditor, editorPasswordLink } from '@/app/actions/cms'
import type { LinkResult } from '@/app/actions/cms'

function LinkBox({ res, email }: { res: LinkResult; email: string }) {
  const [copied, setCopied] = useState(false)
  if (!res.link) return null
  return (
    <div className="adm-linkbox" role="status">
      <strong>
        {res.emailed
          ? `Emailed to ${email}. You can also send them this link yourself:`
          : `Send this link to ${email} (by text, email, however you like):`}
      </strong>
      <input type="text" readOnly value={res.link} onFocus={(e) => e.currentTarget.select()} />
      <span className="adm-actions">
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(res.link!)
              setCopied(true)
            } catch {
              setCopied(false)
            }
          }}
        >
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
        <span className="adm-field__help">
          It lets them choose their own password, works once, and expires in 48 hours.
        </span>
      </span>
    </div>
  )
}

export function AddEditorForm() {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ res: LinkResult; email: string } | null>(null)
  const router = useRouter()

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        const f = new FormData(form)
        const email = String(f.get('email') ?? '')
        setError(null)
        setResult(null)
        start(async () => {
          const res = await addEditor({ name: f.get('name'), email })
          if (!res.ok) {
            setError(res.error)
            return
          }
          form.reset()
          setResult({ res, email })
          router.refresh()
        })
      }}
    >
      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ed-name">Name</label>
          <input id="ed-name" name="name" type="text" required />
        </div>
        <div className="adm-field">
          <label htmlFor="ed-email">Email</label>
          <input id="ed-email" name="email" type="email" required />
        </div>
      </div>
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      <div className="adm-actions">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? 'Adding…' : 'Add editor'}
        </button>
      </div>
      {result && <LinkBox res={result.res} email={result.email} />}
    </form>
  )
}

export function PasswordLinkButton({ userId, email }: { userId: string; email: string }) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<LinkResult | null>(null)
  return (
    <span>
      <button
        type="button"
        className="adm-btn adm-btn--ghost"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setRes(await editorPasswordLink(userId))
          })
        }
      >
        {pending ? 'Making…' : 'New password link'}
      </button>
      {res && !res.ok && <span className="adm-error">{res.error}</span>}
      {res?.ok && <LinkBox res={res} email={email} />}
    </span>
  )
}
