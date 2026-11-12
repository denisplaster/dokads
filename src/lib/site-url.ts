/**
 * The absolute base URL this instance is serving from.
 *
 * Used for both Better Auth (cookies, callbacks) and metadataBase (canonical
 * and Open Graph URLs). Deriving it means preview deployments are correct too,
 * which a hardcoded production domain never is.
 *
 * Order: explicit override, then Vercel's production domain, then the
 * immutable per-deployment URL, then local dev.
 */
export function siteUrl(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:5190'
}

/**
 * Origins allowed to call the auth API. The production domain is reachable as
 * both www and apex (one redirects to the other), and Vercel's
 * VERCEL_PROJECT_PRODUCTION_URL picks whichever is shorter — so trust both
 * spellings, plus this deployment's own URL for previews.
 */
export function trustedOrigins(): string[] {
  const out = new Set<string>()
  const add = (url: string | undefined) => {
    if (!url) return
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`)
      out.add(u.origin)
      const host = u.hostname.startsWith('www.') ? u.hostname.slice(4) : `www.${u.hostname}`
      if (!u.hostname.includes('localhost') && !u.hostname.endsWith('.vercel.app')) {
        out.add(`${u.protocol}//${host}`)
      }
    } catch {
      // ignore malformed values
    }
  }
  add(siteUrl())
  add(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  add(process.env.VERCEL_URL)
  add(process.env.VERCEL_BRANCH_URL)
  return [...out]
}
