'use server'

import { randomBytes } from 'node:crypto'
import { and, count, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/db'
import { pageCopy, user } from '@/db/schema'
import { requireStaff } from '@/lib/auth-guard'
import { auth, makeAuth, resetLinkCapture } from '@/lib/auth'
import { emailConfigured, send } from '@/lib/email/send'
import { siteUrl } from '@/lib/site-url'
import { coerce, fieldsOf, sameValue } from '@/content/fields'
import { PAGES, isPageId } from '@/content/registry'
import { LIVE_KEY, PUBLISH_KEY, setMeta, touchContent } from '@/content/meta'
import type { ActionResult } from './public'

/* Every action re-checks the session. Middleware is not a security boundary. */

const ok = (): ActionResult => ({ ok: true })
const err = (error: string): ActionResult => ({ ok: false, error })

/* ==========================================================================
   PAGE TEXT
   ========================================================================== */

/**
 * Saves one page's text. Only fields that differ from the default are
 * stored; a field set back to its default has its override removed, so the
 * page follows the code again.
 */
export async function savePageCopy(pageId: string, values: Record<string, unknown>): Promise<ActionResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can edit page text.')
  if (!isPageId(pageId)) return err('Unknown page.')
  const def = PAGES[pageId]

  const writes: { key: string; value: unknown }[] = []
  const resets: string[] = []
  for (const { key, field } of fieldsOf(def)) {
    if (!(key in values)) continue
    const v = coerce(field, values[key])
    if (v === undefined) return err(`“${field.label}” could not be saved — it is too long or the wrong shape.`)
    if (sameValue(v, field.default)) resets.push(key)
    else writes.push({ key, value: v })
  }

  for (const key of resets) {
    await db.delete(pageCopy).where(and(eq(pageCopy.page, pageId), eq(pageCopy.key, key)))
  }
  for (const { key, value } of writes) {
    await db
      .insert(pageCopy)
      .values({ page: pageId, key, value, updatedBy: staff.email })
      .onConflictDoUpdate({
        target: [pageCopy.page, pageCopy.key],
        set: { value, updatedBy: staff.email, updatedAt: new Date() },
      })
  }

  await touchContent(staff.email, `text on “${def.title}”`)
  revalidatePath('/admin', 'layout')
  return ok()
}

/* ==========================================================================
   PUBLISH
   ========================================================================== */

/**
 * Rebuilds the public site from the database.
 *
 * Calls the Vercel deploy hook in DEPLOY_HOOK_URL. The build reads the
 * database once (scripts/snapshot.ts) and the new pages replace the old ones
 * when it finishes — usually a minute or two. If the build fails, the
 * previous version simply stays up.
 */
export async function publishSite(): Promise<ActionResult> {
  const staff = await requireStaff()
  const hook = process.env.DEPLOY_HOOK_URL
  if (!hook && process.env.NODE_ENV === 'development') {
    // local development: no hosting to rebuild, so refresh the snapshot the
    // dev server is reading and let it hot-reload
    const { writeSnapshot } = await import('@/content/write-snapshot')
    const takenAt = await writeSnapshot()
    await setMeta(PUBLISH_KEY, { at: takenAt, by: staff.email })
    await setMeta(LIVE_KEY, { snapshotTakenAt: takenAt, builtAt: takenAt, commit: 'local' })
    revalidatePath('/', 'layout')
    return ok()
  }
  if (!hook) {
    return err(
      'Publishing is not set up yet: the site needs a DEPLOY_HOOK_URL. Ask whoever runs the hosting to add it (see README → Publishing).',
    )
  }
  try {
    const res = await fetch(hook, { method: 'POST' })
    if (!res.ok) return err(`The hosting service refused the publish request (${res.status}). Try again in a minute.`)
  } catch {
    return err('Could not reach the hosting service. Check your connection and try again.')
  }
  await setMeta(PUBLISH_KEY, { at: new Date().toISOString(), by: staff.email })
  revalidatePath('/admin', 'layout')
  return ok()
}

/* ==========================================================================
   EDITORS
   ========================================================================== */

export type LinkResult = ActionResult & { link?: string; emailed?: boolean }

/**
 * A one-time "set your password" link for an editor, valid for 48 hours.
 *
 * Generated through Better Auth's own reset flow, so the token is stored and
 * checked exactly like a forgot-password link. The link comes back to the
 * admin to pass on; if email is configured it is also emailed to the editor.
 */
async function passwordLink(email: string): Promise<{ link: string; emailed: boolean }> {
  const capture: { url?: string } = {}
  await resetLinkCapture.run(capture, () =>
    auth.api.requestPasswordReset({ body: { email, redirectTo: '/admin/reset-password' } }),
  )
  if (!capture.url) throw new Error('No link was generated.')

  let emailed = false
  if (emailConfigured()) {
    const res = await send({
      to: email,
      subject: 'Your DOKADS editor account',
      text:
        `You have been given an editor account for DOKADS.\n\n` +
        `Choose your password here (the link works for 48 hours):\n${capture.url}\n\n` +
        `Then sign in at ${siteUrl()}/admin`,
      html:
        `<p>You have been given an editor account for DOKADS.</p>` +
        `<p><a href="${capture.url}">Choose your password</a> (the link works for 48 hours).</p>` +
        `<p>Then sign in at <a href="${siteUrl()}/admin">${siteUrl()}/admin</a>.</p>`,
    })
    emailed = res.sent
  }
  return { link: capture.url, emailed }
}

const editorSchema = z.object({
  name: z.string().trim().min(1, 'Add their name.').max(120),
  email: z.string().trim().toLowerCase().email('That email address does not look right.'),
})

export async function addEditor(input: unknown): Promise<LinkResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can add editors.')
  const parsed = editorSchema.safeParse(input)
  if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Check the form.')
  const { name, email } = parsed.data

  const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (existing) return err('There is already an account with that email. Use “New password link” on it instead.')

  // sign-up is disabled on the served instance; this one exists only for the
  // length of this call. The random password is never shown or stored in
  // plain text — the editor replaces it through the link.
  const bootstrap = makeAuth({ allowSignUp: true })
  await bootstrap.api.signUpEmail({
    body: { email, name, password: randomBytes(32).toString('base64url') },
  })
  await db.update(user).set({ role: 'admin', updatedAt: new Date() }).where(eq(user.email, email))

  try {
    const { link, emailed } = await passwordLink(email)
    revalidatePath('/admin/editors')
    return { ok: true, link, emailed }
  } catch (e) {
    console.error(e)
    return err('The account was created, but the password link could not be made. Use “New password link” on it.')
  }
}

export async function editorPasswordLink(userId: string): Promise<LinkResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can do that.')
  const [row] = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  if (!row) return err('That account no longer exists.')
  try {
    const { link, emailed } = await passwordLink(row.email)
    return { ok: true, link, emailed }
  } catch (e) {
    console.error(e)
    return err('Could not make a link right now. Try again.')
  }
}

export async function removeEditor(userId: string): Promise<ActionResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can remove editors.')
  if (userId === staff.id) return err('You cannot remove your own account. Ask another admin to do it.')
  const [{ admins }] = await db
    .select({ admins: count() })
    .from(user)
    .where(and(eq(user.role, 'admin'), ne(user.id, userId)))
  if (admins === 0) return err('This is the last admin account, so it cannot be removed.')
  // sessions and accounts cascade, so their sign-in stops working immediately
  await db.delete(user).where(eq(user.id, userId))
  revalidatePath('/admin/editors')
  return ok()
}
