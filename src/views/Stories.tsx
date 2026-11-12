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
import { STORY_KINDS } from '../data/stories'
import { contactMailto } from '../lib/site-mode'
import type { Story, StoryKind } from '../data/stories'
import { Rich } from '../components/Rich'
import { vocab } from '../content/vocab'
import type { Copy } from '../content/copy'

export type StoriesText = Copy<'stories'>

const KIND_ORDER = Object.keys(STORY_KINDS) as StoryKind[]

/** Deliberately irregular — the blog must not read as a grid of clones. */
const LAYOUTS = ['standard', 'text', 'quote', 'boxed', 'standard', 'note', 'text', 'boxed'] as const

export function Stories({ stories, text: c }: { stories: Story[]; text: StoriesText }) {
  const [kind, setKind] = useState<StoryKind | 'all'>('all')
  const featured = stories.find((s) => s.featured)
  const list = stories.filter((s) => (kind === 'all' ? true : s.kind === kind))

  return (
    <>
      <ZineSection tone="pink" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            {c.hero.headline}{' '}
            <br />
            <span className="knock">{c.hero.knockout}</span>
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="ink" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* the honest note about Issue 001 */}
      <ZineSection tone="paper" tight className="stories-note">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift" ruled>
            <TapeStrip position="top-left" variant="kraft" width={120} />
            <span className="eyebrow">{c.note.eyebrow}</span>
            {c.note.body.map((para) => (
              <p key={para.slice(0, 32)}>
                <Rich text={para} />
              </p>
            ))}
          </PaperCard>
        </div>
      </ZineSection>

      {/* featured */}
      {featured && (
        <ZineSection tone="bright" className="stories-featured">
          <div className="wrap wrap--wide">
            <SectionHead number="01" kicker={c.list.featured} />
            <ZineArticleCard story={featured} layout="lead" />
          </div>
        </ZineSection>
      )}

      {/* filter + mixed grid */}
      <ZineSection tone="paper" torn="top" className="stories-list">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker={c.list.kicker} />

          <div className="filterbar" role="group" aria-label="Filter stories by type">
            <button
              type="button"
              className={`filterbar__chip ${kind === 'all' ? 'is-on' : ''}`}
              aria-pressed={kind === 'all'}
              onClick={() => setKind('all')}
              style={rot('hair', -1)}
            >
              {c.list.all}
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
                {vocab.storyKind(k).label}
              </button>
            ))}
          </div>

          <p className="filterbar__count" aria-live="polite">
            {list.length} {list.length === 1 ? c.list.one : c.list.many}
            {kind !== 'all' && ` · ${vocab.storyKind(kind).note}`}
          </p>

          {list.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              <p>
                <Rich text={c.list.empty} />
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
            <SectionHead number="03" kicker={c.submit.kicker} />
            <EditorialHeadline size={1}>
              <Rich text={c.submit.headline} />
            </EditorialHeadline>
            <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
              {c.submit.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </div>

          <PaperCard className="submit-card" tilt="tilt" tiltDir={-1} shadow="slab">
            <TapeStrip position="top-center" variant="clear" width={130} />
            <h3 className="submit-card__head">{c.submit.cardTitle}</h3>
            <ul className="submit-card__list">
              {c.submit.cardList.map((item) => (
                <li key={item.lead}>
                  <strong>{item.lead}</strong> <Rich text={item.rest} />
                </li>
              ))}
            </ul>
            <div className="submit-card__foot">
              <Sticker color="red" large href={contactMailto(c.submit.subject)}>
                {c.submit.cta}
              </Sticker>
              <HandwrittenNote tiltDir={1}>{c.submit.note}</HandwrittenNote>
            </div>
          </PaperCard>
        </div>
      </ZineSection>
    </>
  )
}
