/**
 * Three ways to run the site.
 *
 *   static (default) — an informational brochure built from the TypeScript
 *     modules in src/data. No database, no admin, nothing collected. A fresh
 *     clone builds and serves with zero configuration.
 *
 *   cms — the same static public site, but its content comes from Postgres
 *     and an editor manages it in the admin at /admin. The database is read
 *     ONCE, when the site is built (see scripts/snapshot.ts). Visitors only
 *     ever receive prerendered pages, so public traffic never wakes the
 *     database. Edits go live when an editor presses Publish, which triggers
 *     a rebuild. Nothing is collected from visitors.
 *
 *   full — cms plus the join form, event registration, story and resource
 *     submissions, and email. Turns data collection back on.
 */
export type SiteMode = 'static' | 'cms' | 'full'

export function siteMode(): SiteMode {
  const m = process.env.SITE_MODE
  return m === 'full' ? 'full' : m === 'cms' ? 'cms' : 'static'
}

/** True when there is no admin and no database at all. */
export function isStatic(): boolean {
  return siteMode() === 'static'
}

/** The admin exists (cms and full). */
export function adminEnabled(): boolean {
  return siteMode() !== 'static'
}

/** Content is read from the database at build time (cms and full). */
export function contentFromDatabase(): boolean {
  return siteMode() !== 'static'
}

/** Public forms post to the server and personal data is stored (full only). */
export function collectsData(): boolean {
  return siteMode() === 'full'
}

/** Where people are pointed instead of a form while sign-ups are closed. */
export const CONTACT_EMAIL = 'dokads@akconnection.com'

/** A prefilled mailto for CTAs that would otherwise post a form. */
export function contactMailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}
