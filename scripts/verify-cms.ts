/**
 * CMS-mode guarantees, against an in-process Postgres (PGlite).
 *
 *   npm run cms:verify
 *
 * Covers the path a production build takes in cms mode — migrate, import
 * once, snapshot — and the promises that path makes: the import never deletes
 * anything or touches personal data, a database-built site is identical to a
 * file-built one, edits survive later builds, and page-text overrides apply
 * (or fall back safely when malformed).
 */
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { eq } from 'drizzle-orm'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as schema from '../src/db/schema'
import {
  importFilesIfNeeded,
  snapshotFromDb,
  snapshotFromFiles,
} from '../src/content/build-snapshot'
import type { Db } from '../src/content/build-snapshot'
import { PAGES } from '../src/content/registry'
import { coerce, fieldsOf, resolvePage, sameValue } from '../src/content/fields'
import { legalProblems } from '../src/content/legal'
import { Rich } from '../src/components/Rich'

let failures = 0
function check(label: string, ok: boolean, detail = '') {
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

/**
 * Canonical JSON: keys sorted (Postgres jsonb does not keep key order) and
 * `false` treated like an absent flag — what the pages would render.
 */
function canon(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(canon)
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.keys(v)
        .sort()
        .filter((k) => (v as Record<string, unknown>)[k] !== undefined && (v as Record<string, unknown>)[k] !== false)
        .map((k) => [k, canon((v as Record<string, unknown>)[k])]),
    )
  }
  return v
}
const json = (v: unknown) => JSON.stringify(canon(v))

/** The fields that differ between two records, for a readable failure. */
function keyDiff(a: Record<string, unknown>, b: Record<string, unknown>): string {
  const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])
  return [...keys]
    .filter((k) => json(a?.[k]) !== json(b?.[k]))
    .map((k) => `${k}: files=${json(a?.[k])?.slice(0, 80)} db=${json(b?.[k])?.slice(0, 80)}`)
    .join(' | ')
}

async function main() {
  const client = new PGlite()
  const raw = drizzle(client, { schema })
  const db = raw as unknown as Db

  console.log('\nMigrations (the migrator the build uses)')
  await migrate(raw, { migrationsFolder: 'drizzle' })
  check('all migrations apply to an empty database', true)
  await migrate(raw, { migrationsFolder: 'drizzle' })
  check('re-running migrations is a no-op', true)

  console.log('\nOne-time import into a database with older content')
  // an older admin's leftovers: a published story and event that are not on
  // the site, and the flagship event under a different id with a registration
  await db.insert(schema.stories).values({
    slug: 'old-placeholder',
    title: 'An old piece',
    status: 'published',
    body: ['x'],
  })
  await db.insert(schema.events).values([
    { id: 'old-event', slug: 'old-event', title: 'Old event', type: 'coffee meetup', status: 'tentative', date: '2026-08-01' },
    { id: 'legacy-id', slug: 'minnesota-dokad-coffee-meetup', title: 'Stale title', type: 'coffee meetup', status: 'tentative', date: '2026-09-20' },
  ])
  await db.insert(schema.eventRegistrations).values({
    id: 'reg-1',
    eventId: 'legacy-id',
    firstName: 'Test',
    email: 'person@example.test',
  })

  const report = await importFilesIfNeeded(db)
  check('first run imports', !!report, report ? `${report.events} events, ${report.stories} stories` : '')
  check(
    'content not on the site is hidden, not deleted',
    !!report?.hidden.some((h) => h.key === 'old-placeholder') &&
      !!report?.hidden.some((h) => h.key === 'old-event'),
    report?.hidden.map((h) => h.key).join(', '),
  )
  const [oldStory] = await db.select().from(schema.stories).where(eq(schema.stories.slug, 'old-placeholder'))
  check('hidden story still exists as a draft', oldStory?.status === 'draft')
  const [flag] = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.slug, 'minnesota-dokad-coffee-meetup'))
  check('a same-slug event is updated in place', flag?.id === 'legacy-id' && flag.status === 'completed')
  const regs = await db.select().from(schema.eventRegistrations)
  check('its registration survives (personal data untouched)', regs.length === 1)

  console.log('\nThe database-built site equals the file-built site')
  // drop the leftovers so both snapshots describe the same records
  await db.delete(schema.stories).where(eq(schema.stories.slug, 'old-placeholder'))
  await db.delete(schema.events).where(eq(schema.events.id, 'old-event'))
  const fromFiles = snapshotFromFiles()
  const fromDb = await snapshotFromDb(db)
  // the flagship kept its older internal id (updated in place); ids are never shown
  const strip = (rows: unknown[]) =>
    rows.map((r) => ({ ...(r as Record<string, unknown>), id: undefined }))
  for (const k of ['events', 'stories', 'regions', 'resources'] as const) {
    const a = (k === 'events' ? strip(fromFiles[k]) : fromFiles[k]) as Record<string, unknown>[]
    const b = (k === 'events' ? strip(fromDb[k]) : fromDb[k]) as Record<string, unknown>[]
    const firstDiff = a.findIndex((x, i) => json(x) !== json(b[i]))
    check(
      `${k} identical`,
      a.length === b.length && firstDiff === -1,
      firstDiff >= 0 ? `#${firstDiff} ${keyDiff(a[firstDiff], b[firstDiff])}` : `${b.length}`,
    )
  }
  check('drafts are not in the snapshot', !fromDb.events.some((e) => e.status === 'draft'))

  console.log('\nEdits survive later builds')
  await db.update(schema.stories).set({ title: 'Edited in the admin' }).where(eq(schema.stories.slug, 'what-even-is-a-dokad'))
  const again = await importFilesIfNeeded(db)
  const [edited] = await db.select().from(schema.stories).where(eq(schema.stories.slug, 'what-even-is-a-dokad'))
  check('the import never runs twice', again === null)
  check('an editor’s change is kept', edited?.title === 'Edited in the admin')

  console.log('\nPage text')
  await db.insert(schema.pageCopy).values([
    { page: 'home', key: 'hero.eyebrow', value: 'Changed in the admin.' },
    { page: 'home', key: 'hero.marquee', value: 'not a list' },
  ])
  const snap = await snapshotFromDb(db)
  const home = resolvePage(PAGES.home, snap.copy.home)
  check('an override reaches the page', home.hero.eyebrow === 'Changed in the admin.')
  check(
    'a malformed override falls back to the default',
    sameValue(home.hero.marquee, PAGES.home.sections.hero.fields.marquee.default),
  )

  let badDefaults: string[] = []
  let unlabelled: string[] = []
  let total = 0
  for (const def of Object.values(PAGES)) {
    for (const { key, field } of fieldsOf(def)) {
      total++
      if (!sameValue(coerce(field, field.default), field.default)) badDefaults.push(`${def.id}:${key}`)
      if (!field.label.trim()) unlabelled.push(`${def.id}:${key}`)
    }
  }
  check(`every default passes its own validation (${total} fields)`, badDefaults.length === 0, badDefaults.join(', '))
  check('every field has a label for the editor', unlabelled.length === 0, unlabelled.join(', '))
  check(
    'page ids match their registry keys',
    Object.entries(PAGES).every(([k, p]) => k === p.id),
  )

  console.log('\nFormatting cannot inject markup')
  const html = (t: string) => renderToStaticMarkup(createElement(Rich, { text: t }))
  check('bold with a link inside', html('**see [this](/x)**') === '<strong>see <a href="/x">this</a></strong>', html('**see [this](/x)**'))
  check('external links open safely', html('[a](https://x.org)').includes('rel="noreferrer"'))
  const js = html('[a](javascript:alert(1))')
  check('javascript: links are dropped', !js.includes('<a') && !js.includes('javascript'), js)
  check('HTML is escaped', html('<script>x</script>') === '&lt;script&gt;x&lt;/script&gt;')
  check('highlight', html('==hi==') === '<span class="highlight">hi</span>')

  console.log('\nLegal and immigration rules')
  const visas = fromFiles.stories.find((s) => s.sensitive)
  check('the bundled legal story passes', !!visas && legalProblems(visas).length === 0, visas ? legalProblems(visas).join(' ') : 'none found')
  const bad = legalProblems({
    sensitive: true,
    lastReviewed: null,
    sources: [{ label: 'blog', href: 'http://example.com' }],
    body: ['You are eligible for an F-4.'],
  })
  check('an undated, unofficial, promising story is refused', bad.length >= 4, `${bad.length} problems`)

  await client.close()
  console.log(failures === 0 ? '\nAll cms checks passed.\n' : `\n${failures} check(s) FAILED.\n`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
