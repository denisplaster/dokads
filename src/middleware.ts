import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { isStatic } from '@/lib/site-mode'

/**
 * Two jobs.
 *
 * In static mode the admin does not exist as far as the outside world is
 * concerned: /admin and the auth API both 404, so nothing reaches the
 * database or Better Auth. The code is all still here — set SITE_MODE=full.
 *
 * Otherwise this is a cheap first gate that bounces anyone without a session
 * cookie before the admin pages render. It is NOT the security boundary — a
 * cookie proves nothing. Every admin page and action calls requireStaff(),
 * which validates the session against the database.
 */
export function middleware(req: NextRequest) {
  if (isStatic()) {
    return new NextResponse(null, { status: 404 })
  }
  if (req.nextUrl.pathname.startsWith('/api/auth')) return NextResponse.next()
  if (getSessionCookie(req)) return NextResponse.next()
  const url = new URL('/admin/sign-in', req.url)
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  // the admin, its unauthenticated password pages, and the auth API. In full
  // mode the sign-in pages and /api/auth pass straight through; in static mode
  // every one of them 404s.
  matcher: ['/admin', '/admin/:path*', '/api/auth/:path*'],
}
