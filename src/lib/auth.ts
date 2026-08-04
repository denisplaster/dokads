import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { siteUrl } from './site-url'

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is not set. Generate one with: openssl rand -base64 32')
}

/**
 * Admin authentication.
 *
 * Email + password for a small, known set of organisers. Sign-up is disabled
 * on the instance the app serves, so the only way an account comes into
 * existence is `npm run admin:create`, run deliberately by someone with shell
 * access. That script builds its own instance with `allowSignUp` — the public
 * HTTP surface never has it.
 */
export function makeAuth({ allowSignUp = false }: { allowSignUp?: boolean } = {}) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      minPasswordLength: 12,
    },
    user: {
      additionalFields: {
        role: { type: 'string', defaultValue: 'organiser', input: false },
        regionSlug: { type: 'string', required: false, input: false },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: siteUrl(),
    plugins: [nextCookies()],
  })
}

/** The instance the application serves. No sign-up. */
export const auth = makeAuth()

export type AuthSession = typeof auth.$Infer.Session
