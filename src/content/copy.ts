import { resolvePage } from './fields'
import type { PageValues } from './fields'
import { PAGES } from './registry'
import type { PageId } from './registry'
import { snapshot } from './snapshot'

export type Copy<K extends PageId> = PageValues<(typeof PAGES)[K]>

const cache = new Map<PageId, unknown>()

/**
 * The text a page renders with: the defaults declared in src/content/pages,
 * with any edits from the admin (frozen into the build snapshot) on top.
 *
 * Server-only in practice: it pulls in the whole snapshot. Client components
 * receive the values they need as props instead.
 */
export function copy<K extends PageId>(id: K): Copy<K> {
  if (!cache.has(id)) cache.set(id, resolvePage(PAGES[id], snapshot.copy[id]))
  return cache.get(id) as Copy<K>
}
