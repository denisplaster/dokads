'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function ResetForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')

  if (!token) {
    return (
      <p className="adm-error">
        This link is missing its token. Request a new one from{' '}
        <Link href="/admin/forgot-password">forgot password</Link>.
      </p>
    )
  }

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        if (password !== confirm) {
          setError('Those two passwords do not match.')
          return
        }
        if (password.length < 12) {
          setError('Please use at least 12 characters.')
          return
        }
        start(async () => {
          const res = await authClient.resetPassword({ newPassword: password, token })
          if (res.error) {
            setError('That link has expired or already been used. Request a new one.')
            return
          }
          router.push('/admin/sign-in')
          router.refresh()
        })
      }}
    >
      <div className="adm-field">
        <label htmlFor="rp-password">New password</label>
        <input
          id="rp-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="adm-field">
        <label htmlFor="rp-confirm">Confirm it</label>
        <input
          id="rp-confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  )
}
