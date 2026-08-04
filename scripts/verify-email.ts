/**
 * Email must never be able to lose a registration. This proves it against a
 * real database, with the provider both absent and actively failing.
 */
import { PGlite } from '@electric-sql/pglite'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

process.env.DATABASE_URL = 'pglite://memory'
process.env.BETTER_AUTH_SECRET = 'verification-only-secret-not-real-abcdefgh'

let failures = 0
const check = (label: string, ok: boolean, detail = '') => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

async function main() {
  // stand up an in-process database the app module will reuse
  const client = new PGlite()
  ;(globalThis as Record<string, unknown>).__dokadsPglite = client

  const { drizzle } = await import('drizzle-orm/pglite')
  const schema = await import('../src/db/schema')
  const db = drizzle(client, { schema })
  ;(globalThis as Record<string, unknown>).__dokadsDb = db

  const dir = join(process.cwd(), 'drizzle')
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.sql')).sort()) {
    for (const stmt of readFileSync(join(dir, f), 'utf8').split('--> statement-breakpoint')) {
      if (stmt.trim()) await client.exec(stmt.trim())
    }
  }

  const { eventRows, regionRows } = await import('../src/db/seed-data')
  await db.insert(schema.regions).values(regionRows)
  await db.insert(schema.events).values(eventRows)

  // open one event for registration
  const { eq, count } = await import('drizzle-orm')
  await db
    .update(schema.events)
    .set({ status: 'registration open' })
    .where(eq(schema.events.slug, 'minnesota-dokad-coffee-meetup'))

  const { submitRegistration, submitJoin } = await import('../src/app/actions/public')

  console.log('\nProvider absent (no RESEND_API_KEY)')
  delete process.env.RESEND_API_KEY
  const r1 = await submitRegistration({
    eventSlug: 'minnesota-dokad-coffee-meetup',
    firstName: 'NoMail',
    email: 'nomail@example.com',
    ageRange: '25-29',
    agreedGuidelines: true,
  })
  check('registration still succeeds', r1.ok, r1.ok ? '' : r1.error)
  const c1 = await db.select({ n: count() }).from(schema.eventRegistrations)
  check('row was written', Number(c1[0].n) === 1)

  console.log('\nProvider configured but failing (bad key, unreachable)')
  process.env.RESEND_API_KEY = 're_invalid_key_for_verification'
  const realFetch = globalThis.fetch
  let attempted = 0
  globalThis.fetch = (async (url: string | URL | Request, ...rest: unknown[]) => {
    if (String(url).includes('api.resend.com')) {
      attempted++
      throw new Error('simulated network failure')
    }
    return (realFetch as (...a: unknown[]) => Promise<Response>)(url, ...rest)
  }) as typeof fetch

  const r2 = await submitRegistration({
    eventSlug: 'minnesota-dokad-coffee-meetup',
    firstName: 'MailFails',
    email: 'mailfails@example.com',
    ageRange: '30-34',
    agreedGuidelines: true,
  })
  check('registration succeeds despite send throwing', r2.ok, r2.ok ? '' : r2.error)

  const j1 = await submitJoin({
    name: 'JoinFails',
    email: 'joinfails@example.com',
    agreedGuidelines: true,
    ageRange: '16-17',
  })
  check('join succeeds despite send throwing', j1.ok, j1.ok ? '' : j1.error)

  // let the fire-and-forget sends settle
  await new Promise((r) => setTimeout(r, 300))
  check('the provider was actually called', attempted > 0, `${attempted} attempt(s)`)

  const c2 = await db.select({ n: count() }).from(schema.eventRegistrations)
  check('both registrations persisted', Number(c2[0].n) === 2, `${c2[0].n} rows`)
  const m = await db.select().from(schema.members)
  check('member persisted with minor flag', m.length === 1 && m[0].isMinor === true)

  globalThis.fetch = realFetch

  console.log('\nTemplates render')
  const { registrationEmail, joinWelcomeEmail, resetPasswordEmail } = await import(
    '../src/lib/email/templates'
  )
  const [ev] = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.slug, 'minnesota-dokad-coffee-meetup'))

  const tentative = { ...ev, status: 'tentative' }
  const t = registrationEmail({ firstName: 'Sam', event: tentative, status: 'registered', site: 'https://www.dokads.com' })
  check('tentative email says it is not confirmed', /not confirmed yet/i.test(t.html))
  check('tentative email lists what may change', /What is not settled yet/i.test(t.html))
  check('tentative email includes the backup date', /September 20, 2026/.test(t.html))
  check('perk is hedged while tentative', /do not count on it/i.test(t.html))

  const open = registrationEmail({ firstName: 'Sam', event: ev, status: 'registered', site: 'https://www.dokads.com' })
  check('confirmed email drops the hedge', !/not confirmed yet/i.test(open.html))

  const wl = registrationEmail({ firstName: 'Sam', event: ev, status: 'waitlist', site: 'https://www.dokads.com' })
  check('waitlist email says waitlist', /waitlist/i.test(wl.subject))

  const jm = joinWelcomeEmail({ name: 'Sam', site: 'https://www.dokads.com', isMinor: true })
  check('minor welcome carries the privacy notice', /under 18/i.test(jm.html))
  const ja = joinWelcomeEmail({ name: 'Sam', site: 'https://www.dokads.com', isMinor: false })
  check('adult welcome does not', !/under 18/i.test(ja.html))

  for (const [name, tpl] of Object.entries({ tentative: t, open, waitlist: wl, join: ja })) {
    check(`${name}: deletion promise present`, /delete everything we hold about you/i.test(tpl.html))
    check(`${name}: plain-text alternative present`, tpl.text.length > 80)
  }

  const rp = resetPasswordEmail({ url: 'https://www.dokads.com/admin/reset-password?token=x', site: 'https://www.dokads.com' })
  check('reset email contains the link', rp.html.includes('token=x'))

  await client.close()
  console.log(failures === 0 ? '\nAll email checks passed.\n' : `\n${failures} FAILED.\n`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
