/**
 * The connection string, from whichever variable the environment provides.
 *
 * Vercel's Neon integration injects POSTGRES_URL (and friends); DATABASE_URL
 * is what this project documents and what local .env files set. Either works.
 */
export function databaseUrlFromEnv(): string | undefined {
  return (process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim() || undefined
}
