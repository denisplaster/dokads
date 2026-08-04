import type { Metadata } from 'next'
import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { SignOutButton } from './sign-out-button'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/registrations', label: 'Registrations' },
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/inbox', label: 'Inbox' },
  { href: '/admin/stories', label: 'Stories' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/regions', label: 'Regions' },
] as const

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // the real gate — middleware only checks that a cookie exists
  const staff = await requireStaff()

  return (
    <div className="adm">
      <header className="adm-bar">
        <Link href="/admin" className="adm-bar__brand">
          DOKADS admin
        </Link>
        <nav className="adm-bar__nav" aria-label="Admin">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="adm-bar__who">
          <span>{staff.email}</span>
          <span className="adm-bar__role">
            {staff.role === 'admin' ? 'admin' : `organiser · ${staff.regionSlug ?? 'unscoped'}`}
          </span>
          <Link href="/" className="adm-bar__brand" style={{ fontSize: '0.8rem' }}>
            View site ↗
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </div>
  )
}
