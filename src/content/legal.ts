/**
 * LEGAL_RULES (src/data/topics.ts) as checks a machine can run.
 *
 * Applied in two places: the admin refuses to save a story marked
 * legal / immigration that breaks them, and scripts/verify-static.ts fails the
 * build if one ever reaches the snapshot anyway.
 */
export type LegalStory = {
  sensitive?: boolean
  lastReviewed?: string | null
  sources?: { label: string; href: string }[] | null
  body: string[]
}

const OFFICIAL = /^https:\/\/([a-z0-9-]+\.)*(go\.kr|gov|gov\.[a-z]{2}|gc\.ca|gouv\.fr|europa\.eu)(\/|$)/i

/** Phrases that promise eligibility outright. */
export function promisesEligibility(body: string[]): boolean {
  const text = body.join(' ').toLowerCase()
  return (
    /you (are|will be) (automatically )?(entitled|eligible)\b/.test(text) ||
    /guarantee[sd]? (you|your)/.test(text)
  )
}

/** Plain-language problems with a sensitive story; empty when it is fine. */
export function legalProblems(story: LegalStory): string[] {
  if (!story.sensitive) return []
  const problems: string[] = []
  if (!story.lastReviewed || !/^\d{4}-\d{2}-\d{2}$/.test(story.lastReviewed)) {
    problems.push('Add the date it was last checked against official sources.')
  }
  const sources = story.sources ?? []
  if (!sources.length) {
    problems.push('Add at least one source.')
  } else {
    if (!sources.every((s) => s.href.startsWith('https://'))) {
      problems.push('Every source link must start with https://.')
    }
    if (!sources.some((s) => OFFICIAL.test(s.href))) {
      problems.push(
        'At least one source must be an official government site (for Korea, an address ending in .go.kr).',
      )
    }
  }
  if (promisesEligibility(story.body)) {
    problems.push(
      'The text promises eligibility outright (“you are eligible”, “guarantees you…”). Rules depend on more than a family relationship — reword it.',
    )
  }
  if (!/not a promise|never where it ends|not automatic/i.test(story.body.join(' '))) {
    problems.push(
      'Say plainly that eligibility is not automatic — for example, include the words “not automatic”.',
    )
  }
  return problems
}
