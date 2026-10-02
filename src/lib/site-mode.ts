/**
 * Static mode — the site runs as a purely informational brochure.
 *
 * In static mode nothing the site serves needs the network: content comes from
 * the TypeScript modules in src/data rather than Postgres, no form collects
 * anything, no email is sent, and the admin is not reachable. A fresh clone
 * builds and serves with zero environment configuration.
 *
 * The database, auth, email and admin code all remain in the repository and
 * keep passing their test suites. Set SITE_MODE=full to turn them back on.
 */
export type SiteMode = 'static' | 'full'

export function siteMode(): SiteMode {
  return process.env.SITE_MODE === 'full' ? 'full' : 'static'
}

/** True when the site must not touch the database, email, or collect data. */
export function isStatic(): boolean {
  return siteMode() === 'static'
}

/** Where people are pointed instead of a form while sign-ups are closed. */
export const CONTACT_EMAIL = 'dokads@akconnection.com'

/** A prefilled mailto for CTAs that would otherwise post a form. */
export function contactMailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}
