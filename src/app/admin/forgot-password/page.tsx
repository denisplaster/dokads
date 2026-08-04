import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotForm } from './form'

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="adm-signin">
      <div className="adm-signin__box">
        <h1>Forgot your password</h1>
        <p>We’ll email you a link to choose a new one. The link expires in an hour.</p>
        <ForgotForm />
        <p style={{ marginTop: 'var(--s-5)', fontSize: 'var(--t-small)' }}>
          <Link href="/admin/sign-in">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
