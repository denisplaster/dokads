import type { Metadata } from 'next'
import { Suspense } from 'react'
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
          For organisers. There is no public sign-up — accounts are created from the command
          line with <code>npm run admin:create</code>.
        </p>
        {/* the form reads ?next= to bounce back after signing in */}
        <Suspense fallback={<p className="adm-field__help">Loading…</p>}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
