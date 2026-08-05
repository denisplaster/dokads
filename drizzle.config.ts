import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { describeDatabaseUrl, requireDatabaseUrl } from './scripts/db-url'

const url = requireDatabaseUrl()
console.log(`Target database: ${describeDatabaseUrl(url)}\n`)

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
  verbose: true,
})
