/**
 * site_meta bookkeeping: what changed when, and what the live site shows.
 * Server-only (admin actions and build scripts) — never imported by a page.
 */
import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { siteMeta } from '@/db/schema'

/** set by every admin save that changes public content */
export const CHANGED_KEY = 'content_changed'
/** set when an editor presses Publish */
export const PUBLISH_KEY = 'publish_requested'
/** set by scripts/mark-built.ts after a production build */
export const LIVE_KEY = 'live'
export { IMPORT_KEY } from './build-snapshot'

export async function setMeta(key: string, value: Record<string, unknown>) {
  await db
    .insert(siteMeta)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteMeta.key, set: { value, updatedAt: new Date() } })
}

export async function getMetas(keys: string[]): Promise<Record<string, Record<string, unknown>>> {
  const rows = await db.select().from(siteMeta).where(inArray(siteMeta.key, keys))
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function getMeta(key: string): Promise<Record<string, unknown> | undefined> {
  const [row] = await db.select().from(siteMeta).where(eq(siteMeta.key, key)).limit(1)
  return row?.value
}

/** Note that public content changed, and who changed it. */
export async function touchContent(by: string, what: string) {
  await setMeta(CHANGED_KEY, { at: new Date().toISOString(), by, what })
}
