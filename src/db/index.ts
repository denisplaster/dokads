import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Locally, copy .env.example to .env and paste a Neon ' +
      'branch connection string. On Vercel, the Neon integration injects it.',
  )
}

export const db = drizzle(neon(url), { schema })
export { schema }
