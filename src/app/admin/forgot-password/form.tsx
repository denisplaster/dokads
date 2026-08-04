'use client'

import { useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'

export function ForgotForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  if (done) {
    return (
      <p className="adm-ok">
        If that address has an account, a reset link is on its way. Check spam if it does not
        arrive in a few minutes.
      </p>
    )
  }

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        start(async () => {
          const res = await authClient.requestPasswordReset({
            email,
            redirectTo: '/admin/reset-password',
          })
          // never reveal whether an address has an account
          if (res.error && res.error.status !== 400) {
            setError('Could not send the email right now. Try again shortly.')
            return
          }
          setDone(true)
        })
      }}
    >
      <div className="adm-field">
        <label htmlFor="fp-email">Email</label>
        <input
          id="fp-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? 'Sending…' : 'Email me a link'}
      </button>
    </form>
  )
}
