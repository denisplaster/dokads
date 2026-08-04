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
