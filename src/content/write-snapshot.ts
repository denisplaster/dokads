/**
 * Development only: rewrite the snapshot from the database the dev server is
 * using, so "Publish" can be tried locally without hosting. Production
 * publishes by rebuilding (scripts/snapshot.ts runs as part of the build).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { db } from '@/db'
import { snapshotFromDb } from './build-snapshot'

export async function writeSnapshot(): Promise<string> {
  const snap = await snapshotFromDb(db)
  const dir = join(process.cwd(), 'src/generated')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'content.json'), `${JSON.stringify(snap, null, 2)}\n`)
  writeFileSync(
    join(dir, 'labels.json'),
    `${JSON.stringify({ overrides: snap.copy.labels ?? {} }, null, 2)}\n`,
  )
  return snap.takenAt ?? new Date().toISOString()
}
