import { createRequire } from 'node:module'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error(
    'DATABASE_URL is not set.\n' +
      '  · On Vercel: add the Neon integration and it is injected for you.\n' +
      '  · Locally:   copy .env.example to .env, then either paste a Neon branch\n' +
      '               connection string or use DATABASE_URL="pglite://.data/dev"\n' +
      '               for a throwaway local database with no setup.',
  )
}

/**
 * Production and preview run on Neon over HTTP.
 *
 * `pglite://<path>` is a local-development escape hatch: an in-process
 * Postgres so the app can run with no database account and no daemon. It is
 * loaded through createRequire and marked external in next.config.ts, so the
 * dependency never enters a production bundle.
 */
function createDb(): NeonHttpDatabase<typeof schema> {
  if (url!.startsWith('pglite://')) {
    // Guard the real hazard — shipping a local file database to a deployment —
    // without blocking `next build` on a laptop, which also runs in production
    // mode. VERCEL is set during both build and runtime on Vercel.
    if (process.env.VERCEL) {
      throw new Error(
        'DATABASE_URL is set to pglite:// on Vercel. That is a local-only file ' +
          'database. Connect Neon (Storage → Neon) so DATABASE_URL is injected.',
      )
    }
    const req = createRequire(import.meta.url)
    const { PGlite } = req('@electric-sql/pglite')
    const { drizzle: pgliteDrizzle } = req('drizzle-orm/pglite')
    const dir = url!.replace('pglite://', '')
    // cached on globalThis so dev-server hot reloads reuse one instance
    const g = globalThis as unknown as { __dokadsPglite?: unknown }
    g.__dokadsPglite ??= new PGlite(dir)
    return pgliteDrizzle(g.__dokadsPglite, { schema }) as unknown as NeonHttpDatabase<
      typeof schema
    >
  }
  return drizzle(neon(url!), { schema })
}

const g = globalThis as unknown as { __dokadsDb?: NeonHttpDatabase<typeof schema> }
export const db = (g.__dokadsDb ??= createDb())

/**
 * If a page throws Postgres error 42P01 ("undefined table"), the migrations
 * have not been applied to that database. Fix:
 *   DATABASE_URL="<neon url>" npm run db:migrate
 *   DATABASE_URL="<neon url>" npm run db:seed
 */

export { schema }
