/**
 * Content that combines editable words with things that stay in code —
 * colours, artwork, link targets, ordering. Page definitions in ./pages must
 * never import ./copy (that would be a cycle through the registry), so the
 * merging happens here.
 */
import { pillars as basePillars } from '@/data/pillars'
import type { Pillar } from '@/data/pillars'
import { copy } from './copy'

/** The four Who / What / Where / Why panels with their editable words applied. */
export function pillarList(): Pillar[] {
  const words = copy('pillars').panels.panels
  return basePillars.map((p, i) => ({ ...p, ...words[i] }))
}
