import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { SignInForm } from './form'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <div className="adm-signin">
      <div className="adm-signin__box">
        <h1>DOKADS admin</h1>
        <p>
          For the people who edit this site. There is no public sign-up — an existing editor
          adds you under Editors and sends you a link to choose your password.
        </p>
        {/* the form reads ?next= to bounce back after signing in */}
        <Suspense fallback={<p className="adm-field__help">Loading…</p>}>
          <SignInForm />
        </Suspense>
        <p style={{ marginTop: 'var(--s-5)', fontSize: 'var(--t-small)' }}>
          <Link href="/admin/forgot-password">Forgot your password?</Link>
        </p>
      </div>
    </div>
  )
}
