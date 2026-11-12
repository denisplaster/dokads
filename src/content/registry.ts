import { shared } from './pages/shared'
import { home } from './pages/home'
import { pillarsPage } from './pages/pillars'
import { start } from './pages/start'
import { amIaDokad } from './pages/am-i-a-dokad'
import { learn } from './pages/learn'
import { about } from './pages/about'
import { guidelinesPage } from './pages/guidelines'
import { privacy } from './pages/privacy'
import { share } from './pages/share'
import { join } from './pages/join'
import { labels } from './pages/labels'
import { eventsPage } from './pages/events'
import { storiesPage } from './pages/stories'
import { resourcesPage } from './pages/resources'
import { regionsPage } from './pages/regions'

/**
 * Every editable page, in the order the admin lists them. Add a page here
 * and it appears in the admin automatically.
 */
export const PAGES = {
  home,
  start,
  'am-i-a-dokad': amIaDokad,
  learn,
  about,
  guidelines: guidelinesPage,
  join,
  share,
  privacy,
  events: eventsPage,
  stories: storiesPage,
  resources: resourcesPage,
  regions: regionsPage,
  pillars: pillarsPage,
  shared,
  labels,
} as const

export type PageId = keyof typeof PAGES

export function isPageId(id: string): id is PageId {
  return Object.prototype.hasOwnProperty.call(PAGES, id)
}
