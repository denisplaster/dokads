import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

/**
 * A cheap first gate: bounce anyone without a session cookie before the admin
 * pages render. This is NOT the security boundary — a cookie's presence proves
 * nothing. Every admin page and action calls requireStaff(), which validates
 * the session against the database.
 */
export function middleware(req: NextRequest) {
  if (getSessionCookie(req)) return NextResponse.next()
  const url = new URL('/admin/sign-in', req.url)
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  // everything under /admin except the sign-in page itself
  matcher: ['/admin/((?!sign-in|forgot-password|reset-password).*)', '/admin'],
}
