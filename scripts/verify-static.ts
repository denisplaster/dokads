/**
 * Static-mode guarantees.
 *
 * The point of static mode is that the public site needs no network: no
 * database, no email, no data collection. These assertions are what stop that
 * quietly eroding — most of them encode a rule the site states out loud.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

let failures = 0
const check = (label: string, ok: boolean, detail = '') => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (/\.tsx?$/.test(p)) out.push(p)
  }
  return out
}

async function main() {
  console.log('\nContent rules')
  const { getPublicEvents, getEventBySlug, getPublishedStories, getAllRegions, getPublishedRegion } =
    await import('../src/lib/content')
  const { events: allEvents } = await import('../src/data/events')

  const pub = getPublicEvents()
  const drafts = allEvents.filter((e) => e.status === 'draft')
  check(
    'draft events excluded from the public list',
    pub.length === allEvents.length - drafts.length && !pub.some((e) => e.status === 'draft'),
    `${pub.length} public of ${allEvents.length}, ${drafts.length} draft`,
  )
  check(
    'draft events unreachable by slug',
    drafts.every((d) => getEventBySlug(d.slug) === undefined),
  )
  check('public events sorted by date', pub.every((e, i) => i === 0 || pub[i - 1].date <= e.date))
  check(
    'no story claims to be a personal account',
    getPublishedStories().every((s) => !s.isPlaceholder && s.byline === 'DOKADS editorial'),
  )
  check(
    'interest-only regions have no page',
    getAllRegions()
      .filter((r) => r.status === 'interest')
      .every((r) => getPublishedRegion(r.slug) === undefined),
  )

  console.log('\nLEGAL_RULES on sensitive content')
  const { LEGAL_DISCLAIMER } = await import('../src/data/topics')
  const sensitive = getPublishedStories().filter((st) => st.sensitive)
  check('at least one sensitive story exists to check', sensitive.length > 0, `${sensitive.length}`)
  check(
    'every sensitive story shows when it was last reviewed',
    sensitive.every((st) => !!st.lastReviewed && /^\d{4}-\d{2}-\d{2}$/.test(st.lastReviewed)),
  )
  check(
    'every sensitive story cites official sources',
    sensitive.every((st) => (st.sources?.length ?? 0) > 0),
  )
  check(
    'sources are https and at least one is an official .go.kr source',
    sensitive.every(
      (st) =>
        (st.sources ?? []).every((src) => src.href.startsWith('https://')) &&
        (st.sources ?? []).some((src) => src.href.includes('.go.kr')),
    ),
  )
  check(
    'the not-legal-advice disclaimer is rendered, not just stored',
    /LEGAL_DISCLAIMER/.test(readFileSync('src/views/StoryPage.tsx', 'utf8')) &&
      LEGAL_DISCLAIMER.toLowerCase().includes('not legal advice'),
  )
  // the rule that matters most: never promise eligibility from a relationship alone
  const promises = sensitive.filter((st) => {
    const text = st.body.join(' ').toLowerCase()
    return /you (are|will be) (automatically )?(entitled|eligible)\b/.test(text) ||
      /guarantee[sd]? (you|your)/.test(text)
  })
  check('no sensitive story promises eligibility outright', promises.length === 0,
    promises.map((p) => p.slug).join(', '))
  check(
    'sensitive story states that eligibility is not automatic',
    sensitive.every((st) => /not a promise|never where it ends|not automatic/i.test(st.body.join(' '))),
  )

  console.log('\nNo network in the public tree')
  const siteFiles = walk('src/app/(site)')
  const dbImports = siteFiles.filter((f) => /from '@\/db|from '@\/lib\/adapt/.test(readFileSync(f, 'utf8')))
  check('no public page imports the database', dbImports.length === 0, dbImports.join(', '))

  const dynamicPages = siteFiles.filter((f) => /force-dynamic|export const revalidate/.test(readFileSync(f, 'utf8')))
  check('every public page is static', dynamicPages.length === 0, dynamicPages.join(', '))

  // views are what actually render; none may call a server action in static mode
  const viewFiles = walk('src/views')
  const actionCalls = viewFiles.filter(
    (f) =>
      /from '\.\.\/app\/actions/.test(readFileSync(f, 'utf8')) &&
      !/Join\.tsx$/.test(f), // Join.tsx is the full-mode questionnaire, not rendered in static mode
  )
  check('no static-mode view calls a server action', actionCalls.length === 0, actionCalls.join(', '))

  console.log('\nMode switch')
  const prev = process.env.SITE_MODE
  delete process.env.SITE_MODE
  const mode = await import('../src/lib/site-mode')
  check('defaults to static with no env set', mode.isStatic())
  process.env.SITE_MODE = 'full'
  check('SITE_MODE=full turns the database back on', !mode.isStatic())
  if (prev === undefined) delete process.env.SITE_MODE
  else process.env.SITE_MODE = prev

  const mw = readFileSync('src/middleware.ts', 'utf8')
  check('middleware 404s the admin in static mode', /isStatic\(\)/.test(mw) && /404/.test(mw))
  check('middleware also covers the auth API', /api\/auth/.test(mw))

  console.log(failures === 0 ? '\nAll static-mode checks passed.\n' : `\n${failures} FAILED.\n`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
