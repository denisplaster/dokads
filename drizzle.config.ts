import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { requireDatabaseUrl } from './scripts/db-url'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: requireDatabaseUrl() },
  strict: true,
  verbose: true,
})
