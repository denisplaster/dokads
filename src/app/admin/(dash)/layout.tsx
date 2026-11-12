import type { Metadata } from 'next'
import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { collectsData } from '@/lib/site-mode'
import { PublishBar } from '@/components/admin/PublishBar'
import { db } from '@/db'
import { eventRegistrations, members, submissions } from '@/db/schema'
import { SignOutButton } from './sign-out-button'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

/** Content — always present when the admin exists. */
const CONTENT_NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/stories', label: 'Stories' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/regions', label: 'Regions' },
] as const

/**
 * Personal data — shown when the site collects it (SITE_MODE=full), and also
 * whenever any is still stored from a time it did, so that a request to
 * delete someone's data can always be carried out.
 */
const PEOPLE_NAV = [
  { href: '/admin/registrations', label: 'Registrations' },
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/inbox', label: 'Inbox' },
] as const

async function holdsPersonalData(): Promise<boolean> {
  const [m, r, s] = await Promise.all([
    db.select({ id: members.id }).from(members).limit(1),
    db.select({ id: eventRegistrations.id }).from(eventRegistrations).limit(1),
    db.select({ id: submissions.id }).from(submissions).limit(1),
  ])
  return m.length + r.length + s.length > 0
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // the real gate — middleware only checks that a cookie exists
  const staff = await requireStaff()
  const NAV = [
    ...CONTENT_NAV,
    ...(collectsData() || (await holdsPersonalData()) ? PEOPLE_NAV : []),
    ...(staff.role === 'admin' ? [{ href: '/admin/editors', label: 'Editors' } as const] : []),
  ]

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
      <main className="adm-main">
        <PublishBar />
        {children}
      </main>
    </div>
  )
}
