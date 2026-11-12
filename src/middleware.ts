import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { isStatic } from '@/lib/site-mode'

/** Reachable without a session: signing in, and getting back in. */
const OPEN = ['/admin/sign-in', '/admin/forgot-password', '/admin/reset-password']

/**
 * Two jobs.
 *
 * In static mode the admin does not exist as far as the outside world is
 * concerned: /admin and the auth API both 404, so nothing reaches the
 * database or Better Auth.
 *
 * Otherwise this is a cheap first gate that bounces anyone without a session
 * cookie before the admin pages render. It never touches the database, so
 * bots probing /admin cost nothing. It is NOT the security boundary — a
 * cookie proves nothing. Every admin page and action calls requireStaff(),
 * which validates the session against the database.
 */
export function middleware(req: NextRequest) {
  if (isStatic()) {
    return new NextResponse(null, { status: 404 })
  }
  const path = req.nextUrl.pathname
  if (path.startsWith('/api/auth')) return NextResponse.next()
  if (OPEN.some((p) => path === p || path.startsWith(`${p}/`))) return NextResponse.next()
  if (getSessionCookie(req)) return NextResponse.next()
  const url = new URL('/admin/sign-in', req.url)
  url.searchParams.set('next', path)
  return NextResponse.redirect(url)
}

export const config = {
  // the admin, its unauthenticated password pages, and the auth API. Public
  // pages are not matched at all.
  matcher: ['/admin', '/admin/:path*', '/api/auth/:path*'],
}
