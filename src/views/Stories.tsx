'use client'

import { useState } from 'react'
import {
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineArticleCard,
  ZineSection,
  rot,
} from '../components/zine'
import { STORY_KINDS, stories } from '../data/stories'
import type { StoryKind } from '../data/stories'

const KIND_ORDER = Object.keys(STORY_KINDS) as StoryKind[]

/** Deliberately irregular — the blog must not read as a grid of clones. */
const LAYOUTS = ['standard', 'text', 'quote', 'boxed', 'standard', 'note', 'text', 'boxed'] as const

export function Stories() {
  const [kind, setKind] = useState<StoryKind | 'all'>('all')
  const featured = stories.find((s) => s.featured)
  const list = stories.filter((s) => (kind === 'all' ? true : s.kind === kind))

  return (
    <>
      <ZineSection tone="pink" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            Stories from the{' '}
            <br />
            <span className="knock">next generation</span>
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            Essays, interviews, poems, photographs, and open questions from descendants of
            Korean adoptees. Written by us, about us, on our own terms.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="ink" tiltDir={1}>
              anonymous is a real option →
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* the honest note about Issue 001 */}
      <ZineSection tone="paper" tight className="stories-note">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift" ruled>
            <TapeStrip position="top-left" variant="kraft" width={120} />
            <span className="eyebrow">Editor’s note</span>
            <p>
              <strong>Issue 001 is still being made.</strong> The pieces below are placeholder
              layouts — real writing, real photographs, and real voices go here as they come in.
              Nothing on this page is a record of anybody’s actual family.
            </p>
            <p>
              If you want to be in the first issue, the submission details are at the bottom of
              this page.
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      {/* featured */}
      {featured && (
        <ZineSection tone="bright" className="stories-featured">
          <div className="wrap wrap--wide">
            <SectionHead number="01" kicker="Featured" />
            <ZineArticleCard story={featured} layout="lead" />
          </div>
        </ZineSection>
      )}

      {/* filter + mixed grid */}
      <ZineSection tone="paper" torn="top" className="stories-list">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker="Everything else" />

          <div className="filterbar" role="group" aria-label="Filter stories by type">
            <button
              type="button"
              className={`filterbar__chip ${kind === 'all' ? 'is-on' : ''}`}
              aria-pressed={kind === 'all'}
              onClick={() => setKind('all')}
              style={rot('hair', -1)}
            >
              Everything
            </button>
            {KIND_ORDER.map((k, i) => (
              <button
                key={k}
                type="button"
                className={`filterbar__chip cat--${k} ${kind === k ? 'is-on' : ''}`}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                style={rot('hair', i % 2 === 0 ? 1 : -1)}
              >
                {STORY_KINDS[k].label}
              </button>
            ))}
          </div>

          <p className="filterbar__count" aria-live="polite">
            {list.length} {list.length === 1 ? 'piece' : 'pieces'}
            {kind !== 'all' && ` · ${STORY_KINDS[kind].note}`}
          </p>

          {list.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              <p>
                <strong>Nothing here yet.</strong> This format is open — if you have one, it
                could be the first.
              </p>
            </PaperCard>
          ) : (
            <div className="stories-grid">
              {list.map((s, i) => (
                <div
                  key={s.slug}
                  className={`stories-grid__cell stories-grid__cell--${LAYOUTS[i % LAYOUTS.length]}`}
                >
                  <ZineArticleCard story={s} layout={LAYOUTS[i % LAYOUTS.length]} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </ZineSection>

      {/* submit */}
      <ZineSection tone="ink" torn="top" id="submit" className="stories-submit">
        <div className="wrap wrap--wide stories-submit__inner">
          <div>
            <SectionHead number="03" kicker="Tell us your story" />
            <EditorialHeadline size={1}>
              You do not have to be{' '}
              <br />
              a writer.
            </EditorialHeadline>
            <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
              <p>
                Send four hundred words or four thousand. Send a poem, a voice memo, a scan of
                something from a box in your parents’ basement, or a question you have never
                asked out loud.
              </p>
              <p>
                <strong>You choose how you are credited</strong> — full name, first name only, a
                pseudonym, or anonymous. You can change that later, and you can withdraw a
                piece after it runs.
              </p>
              <p>
                If your piece names other people in your family, we will ask whether they know.
                Nothing about birth family, adoption records, or family relationships gets
                published without you saying so explicitly.
              </p>
            </div>
          </div>

          <PaperCard className="submit-card" tilt="tilt" tiltDir={-1} shadow="slab">
            <TapeStrip position="top-center" variant="clear" width={130} />
            <h3 className="submit-card__head">Ways to be credited</h3>
            <ul className="submit-card__list">
              <li>
                <strong>Full name</strong> — the whole thing
              </li>
              <li>
                <strong>First name</strong> — “By Nari”
              </li>
              <li>
                <strong>Pseudonym</strong> — pick anything
              </li>
              <li>
                <strong>Anonymous</strong> — no byline at all
              </li>
            </ul>
            <div className="submit-card__foot">
              <Sticker color="red" large>
                Pitch a story
              </Sticker>
              <HandwrittenNote tiltDir={1}>
                submissions open with Issue 001
              </HandwrittenNote>
            </div>
          </PaperCard>
        </div>
      </ZineSection>
    </>
  )
}
