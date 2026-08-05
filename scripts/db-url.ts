/**
 * Resolves DATABASE_URL and rejects the things people actually paste by
 * mistake — an unedited placeholder, or a local pglite URL when the intent
 * was clearly a remote database.
 */
export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim()

  if (!url) {
    throw new Error(
      'DATABASE_URL is not set.\n' +
        '  Local:  copy .env.example to .env (pglite://.data/dev works with no account)\n' +
        '  Neon:   export DATABASE_URL="<connection string from Vercel → Storage → Neon>"',
    )
  }

  // the ellipsis from copied documentation, or an unreplaced angle-bracket token
  if (/[…]/.test(url) || /<[^>]*>/.test(url)) {
    throw new Error(
      `DATABASE_URL still contains placeholder text:\n  ${url}\n\n` +
        'Copy the real connection string from Vercel → Storage → your Neon database →\n' +
        '.env.local tab, or from the Neon console. It looks like:\n' +
        '  postgresql://USER:PASSWORD@ep-something-123456.us-east-2.aws.neon.tech/neondb?sslmode=require',
    )
  }

  if (!/^postgres(ql)?:\/\//.test(url) && !url.startsWith('pglite://')) {
    throw new Error(`DATABASE_URL does not look like a Postgres URL:\n  ${url}`)
  }

  return url
}

/**
 * A safe-to-print description of which database a URL points at — no
 * credentials, just enough to tell "this is my laptop" from "this is
 * production" at a glance. Scripts that mutate data should print this before
 * doing anything, since a correct-looking command with the wrong DATABASE_URL
 * in scope silently writes to the wrong place.
 */
export function describeDatabaseUrl(url: string): string {
  if (url.startsWith('pglite://')) {
    return `LOCAL file database (${url.replace('pglite://', '')})`
  }
  try {
    const u = new URL(url)
    return `${u.hostname}${u.pathname}`
  } catch {
    return '(unparseable URL)'
  }
}
