/**
 * Runs after a successful `next build`. On a production build in cms or full
 * mode, records which content snapshot the new deployment was built from, so
 * the admin can tell an editor whether their latest changes are live yet.
 *
 * Everywhere else (static mode, preview builds, local builds) it does
 * nothing — only production defines what "live" means.
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { contentFromDatabase } from '../src/lib/site-mode'
import type { ContentSnapshot } from '../src/content/snapshot-types'

const SNAPSHOT_PATH = 'src/generated/content.json'

async function main() {
  if (!contentFromDatabase() || process.env.VERCEL_ENV !== 'production') return
  const snap = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as ContentSnapshot
  if (snap.source !== 'database' || !snap.takenAt) return

  const { setMeta, LIVE_KEY } = await import('../src/content/meta')
  await setMeta(LIVE_KEY, {
    snapshotTakenAt: snap.takenAt,
    builtAt: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  })
  console.log(`content: marked snapshot ${snap.takenAt} as the one going live`)
}

main().catch((err) => {
  // the deployment itself is fine; only the admin's "is it live?" hint is stale
  console.error('content: could not record the live snapshot —', err)
})
