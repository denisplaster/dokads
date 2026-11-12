/**
 * Prints a one-time "choose your password" link for an editor — creating the
 * account first if it does not exist.
 *
 *   ADMIN_EMAIL="person@example.com" npm run admin:link
 *
 * This is the way in when nobody can sign in at all: the first editor on a
 * new database, or every editor locked out while "forgot password" emails are
 * switched off. Once someone is in, they add and unlock everyone else from
 * Editors in the admin instead.
 *
 * Run it with the production DATABASE_URL (from the Neon console). The link
 * points at BETTER_AUTH_URL, defaulting to https://www.dokads.com for a remote
 * database. It works once and expires after 48 hours. No password is ever
 * printed, chosen, or stored by this script.
 */
import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import { describeDatabaseUrl, requireDatabaseUrl } from './db-url'

async function main() {
  const url = requireDatabaseUrl()
  console.log(`Target database: ${describeDatabaseUrl(url)}\n`)
  if (!url.startsWith('pglite://')) process.env.BETTER_AUTH_URL ||= 'https://www.dokads.com'
  process.env.BETTER_AUTH_SECRET ||= randomBytes(32).toString('base64')

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const name = process.env.ADMIN_NAME?.trim() || 'Editor'
  if (!email) {
    console.error('Set ADMIN_EMAIL, then run this again:')
    console.error('  ADMIN_EMAIL="person@example.com" npm run admin:link')
    process.exit(1)
  }

  const { eq } = await import('drizzle-orm')
  const { db } = await import('../src/db')
  const { user } = await import('../src/db/schema')
  const { auth, makeAuth, resetLinkCapture } = await import('../src/lib/auth')

  const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (!existing) {
    await makeAuth({ allowSignUp: true }).api.signUpEmail({
      body: { email, name, password: randomBytes(32).toString('base64url') },
    })
    console.log(`✓ Created an editor account for ${email}`)
  }
  await db.update(user).set({ role: 'admin', updatedAt: new Date() }).where(eq(user.email, email))

  const capture: { url?: string } = {}
  await resetLinkCapture.run(capture, () =>
    auth.api.requestPasswordReset({ body: { email, redirectTo: '/admin/reset-password' } }),
  )
  if (!capture.url) throw new Error('No link was generated.')

  console.log(`\nSend this to ${email} (it works once, for 48 hours):\n\n  ${capture.url}\n`)
  console.log('They choose their own password there, then sign in at /admin.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
