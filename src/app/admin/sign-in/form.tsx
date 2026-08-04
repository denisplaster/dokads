'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Route } from 'next'
import { authClient } from '@/lib/auth-client'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()
  const params = useSearchParams()

  /** Only ever redirect to an internal admin path. */
  const nextParam = params.get('next')
  const target: Route =
    nextParam && nextParam.startsWith('/admin') && !nextParam.startsWith('//')
      ? (nextParam as Route)
      : ('/admin' as Route)

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        start(async () => {
          const res = await authClient.signIn.email({ email, password })
          if (res.error) {
            // deliberately vague: do not confirm whether an address exists
            setError('That email and password did not match.')
            return
          }
          router.push(target)
          router.refresh()
        })
      }}
    >
      <div className="adm-field">
        <label htmlFor="si-email">Email</label>
        <input
          id="si-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="adm-field">
        <label htmlFor="si-password">Password</label>
        <input
          id="si-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
