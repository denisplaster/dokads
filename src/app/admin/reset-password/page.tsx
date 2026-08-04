import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetForm } from './form'

export const metadata: Metadata = {
  title: 'Choose a new password',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <div className="adm-signin">
      <div className="adm-signin__box">
        <h1>Choose a new password</h1>
        <p>At least 12 characters. A passphrase of a few words is easier and stronger.</p>
        <Suspense fallback={<p className="adm-field__help">Loading…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
