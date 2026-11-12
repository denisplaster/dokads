'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { publishSite } from '@/app/actions/cms'

export function PublishButton({ label = 'Publish site' }: { label?: string }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  return (
    <span className="adm-actions">
      <button
        type="button"
        className="adm-btn adm-btn--publish"
        disabled={pending}
        onClick={() => {
          setError(null)
          start(async () => {
            const res = await publishSite()
            if (!res.ok) setError(res.error)
            else router.refresh()
          })
        }}
      >
        {pending ? 'Starting…' : label}
      </button>
      {error && (
        <span className="adm-error" role="alert">
          {error}
        </span>
      )}
    </span>
  )
}
