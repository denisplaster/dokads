'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      type="button"
      className="adm-btn adm-btn--ghost"
      style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}
      disabled={pending}
      onClick={() =>
        start(async () => {
          await authClient.signOut()
          router.push('/admin/sign-in')
          router.refresh()
        })
      }
    >
      {pending ? '…' : 'Sign out'}
    </button>
  )
}
