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

  console.log('\nPast vs upcoming')
  const { getUpcomingEvents, getPastEvents } = await import('../src/lib/content')
  const upcoming = getUpcomingEvents()
  const past = getPastEvents()
  check(
    'completed and cancelled events never appear as upcoming',
    !upcoming.some((e) => e.status === 'completed' || e.status === 'cancelled'),
  )
  check('every completed event appears in the past list', past.length === pub.filter((e) => e.status === 'completed').length)
  check(
    'every completed event names its host and links to the host’s page',
    past.every((e) => !!e.host && e.host.href.startsWith('https://')),
  )
  check(
    'no completed event still carries tentative notes or a backup date',
    past.every((e) => !e.tentativeNotes?.length && !e.backupDate),
  )
  const eventPage = readFileSync('src/views/EventPage.tsx', 'utf8')
  const { copy: readCopy } = await import('../src/content/copy')
  check(
    'past events render a recap, not a sign-up',
    /isPast \? \(/.test(eventPage) &&
      /side\.pastHead/.test(eventPage) &&
      readCopy('events').eventSide.pastHead.length > 0,
  )

  console.log('\nLEGAL_RULES on sensitive content')
  const { copy } = await import('../src/content/copy')
  const { legalProblems } = await import('../src/content/legal')
  const LEGAL_DISCLAIMER = copy('shared').legal.disclaimer
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
    /legal\.disclaimer/.test(readFileSync('src/views/StoryPage.tsx', 'utf8')) &&
      LEGAL_DISCLAIMER.toLowerCase().includes('not legal advice'),
  )
  const problems = sensitive.flatMap((st) => legalProblems(st).map((p) => `${st.slug}: ${p}`))
  check('every sensitive story passes the admin’s legal checks', problems.length === 0, problems.join(' '))
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
  // everything a public page can pull in: routes, views, non-admin components,
  // and the content modules they read (not the build-time snapshot writers)
  const BUILD_ONLY = /content\/(build-snapshot|meta|write-snapshot)\.ts$/
  const publicTree = [
    ...siteFiles,
    ...walk('src/views'),
    ...walk('src/components').filter((f) => !f.includes('/admin/')),
    ...walk('src/content').filter((f) => !BUILD_ONLY.test(f)),
  ].filter((f) => !/views\/Join\.tsx$|forms\/RegistrationForm\.tsx$/.test(f))
  const dbImports = publicTree.filter((f) =>
    /from '(@\/|(\.\.\/)+)(db|lib\/adapt|content\/(build-snapshot|meta))/.test(readFileSync(f, 'utf8')),
  )
  check('nothing a public page renders imports the database', dbImports.length === 0, dbImports.join(', '))
  const vocab = readFileSync('src/content/vocab.ts', 'utf8')
  check(
    'the browser-safe vocabulary never loads the full snapshot',
    !/content\.json|from '\.\/(copy|snapshot)'/.test(vocab),
  )
  const clientViews = publicTree.filter((f) => /^'use client'/.test(readFileSync(f, 'utf8')))
  const clientCopy = clientViews.filter((f) => /from '(\.\.\/)+content\/copy'|from '@\/content\/copy'/.test(readFileSync(f, 'utf8').replace(/import type[^\n]*\n/g, '')))
  check('no client component imports the page-text reader', clientCopy.length === 0, clientCopy.join(', '))

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
  check('static mode has no admin and no database content', !mode.adminEnabled() && !mode.contentFromDatabase())
  process.env.SITE_MODE = 'cms'
  check(
    'SITE_MODE=cms: admin and database content, but nothing collected',
    mode.adminEnabled() && mode.contentFromDatabase() && !mode.collectsData(),
  )
  process.env.SITE_MODE = 'full'
  check('SITE_MODE=full turns data collection back on', !mode.isStatic() && mode.collectsData())
  if (prev === undefined) delete process.env.SITE_MODE
  else process.env.SITE_MODE = prev

  const mw = readFileSync('src/middleware.ts', 'utf8')
  check('middleware 404s the admin in static mode', /isStatic\(\)/.test(mw) && /404/.test(mw))
  check('middleware also covers the auth API', /api\/auth/.test(mw))
  check(
    'the sign-in and password pages are reachable without a session',
    ['/admin/sign-in', '/admin/forgot-password', '/admin/reset-password'].every((p) => mw.includes(`'${p}'`)),
  )
  const views = walk('src/views').map((f) => readFileSync(f, 'utf8')).join('\n')
  check(
    'forms and email only render in full mode',
    /collectsData\(\) \? <Join/.test(readFileSync('src/app/(site)/join/page.tsx', 'utf8')) &&
      /!collectsData\(\)/.test(views),
  )

  console.log(failures === 0 ? '\nAll static-mode checks passed.\n' : `\n${failures} FAILED.\n`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
