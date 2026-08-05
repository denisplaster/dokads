/**
 * Creates the first admin account.
 *
 *   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="..." npm run admin:create
 *
 * The password is read from the environment, hashed by Better Auth, and never
 * written anywhere in plain text. Choose it yourself and unset both variables
 * once the account exists. Re-running promotes an existing account to admin
 * rather than creating a duplicate.
 */
import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { makeAuth } from '../src/lib/auth'
import { db } from '../src/db'
import { user } from '../src/db/schema'
import { describeDatabaseUrl, requireDatabaseUrl } from './db-url'

async function main() {
  const url = requireDatabaseUrl()
  console.log(`Target database: ${describeDatabaseUrl(url)}\n`)

  const email = process.env.ADMIN_EMAIL?.trim()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || 'Admin'

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD, then run this again.')
    console.error('Example:')
    console.error('  ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-long-passphrase" npm run admin:create')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error('Password must be at least 12 characters.')
    process.exit(1)
  }

  const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (existing) {
    await db.update(user).set({ role: 'admin', updatedAt: new Date() }).where(eq(user.id, existing.id))
    console.log(`✓ ${email} already existed — promoted to admin.`)
    console.log('  To change the password, use "forgot password" in the app.')
    process.exit(0)
  }

  // sign-up is disabled on the served instance; this local instance is the
  // only door, and it only exists inside this script
  const bootstrap = makeAuth({ allowSignUp: true })
  await bootstrap.api.signUpEmail({ body: { email, password, name } })
  await db.update(user).set({ role: 'admin' }).where(eq(user.email, email))

  console.log(`✓ Admin created: ${email}`)
  console.log('  Sign in at /admin/sign-in')
  console.log('  Now unset ADMIN_PASSWORD from your shell and any .env file.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
