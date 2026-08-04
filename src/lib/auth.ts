import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/db'
import * as schema from '@/db/schema'

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
/**
 * Where this instance thinks it is running.
 *
 * Better Auth needs an absolute base URL for cookies and callbacks. Defaulting
 * to localhost meant a deployment with no BETTER_AUTH_URL set would silently
 * issue sign-in requests against localhost and fail. Vercel already tells us
 * the answer, so derive it rather than requiring one more thing to configure.
 */
function resolveBaseURL(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  // stable across deploys — the production domain
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  // preview deployments get their own immutable URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:5190'
}

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
    baseURL: resolveBaseURL(),
    plugins: [nextCookies()],
  })
}

/** The instance the application serves. No sign-up. */
export const auth = makeAuth()

export type AuthSession = typeof auth.$Infer.Session
