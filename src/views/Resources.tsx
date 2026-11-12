'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { AUDIENCES, FORMATS } from '../data/resources'
import { contactMailto } from '../lib/site-mode'
import type { Audience, Resource, ResourceFormat } from '../data/resources'
import { Rich } from '../components/Rich'
import { vocab } from '../content/vocab'
import type { Copy } from '../content/copy'

export type ResourcesText = Copy<'resources'>

export function Resources({
  resources,
  text: c,
}: {
  resources: Resource[]
  text: ResourcesText
}) {
  const t = c.list
  const [format, setFormat] = useState<ResourceFormat | 'all'>('all')
  const [audience, setAudience] = useState<Audience | 'all'>('all')

  const list = useMemo(
    () =>
      resources.filter(
        (r) =>
          (format === 'all' || r.format === format) &&
          (audience === 'all' || r.audience.includes(audience)),
      ),
    [resources, format, audience],
  )

  return (
    <>
      <ZineSection tone="kraft" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="red" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" tight className="resources-note">
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

      <ZineSection tone="bright" torn="both" className="resources-list">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={t.kicker} />

          <div className="filters">
            <div className="filters__row" role="group" aria-label="Filter by format">
              <span className="filters__label">{t.format}</span>
              <button
                type="button"
                className={`filterbar__chip ${format === 'all' ? 'is-on' : ''}`}
                aria-pressed={format === 'all'}
                onClick={() => setFormat('all')}
              >
                {t.formatAll}
              </button>
              {(Object.keys(FORMATS) as ResourceFormat[]).map((f, i) => (
                <button
                  key={f}
                  type="button"
                  className={`filterbar__chip ${format === f ? 'is-on' : ''}`}
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                  style={rot('hair', i % 2 === 0 ? 1 : -1)}
                >
                  {vocab.format(f).verb}
                </button>
              ))}
            </div>

            <div className="filters__row" role="group" aria-label="Filter by who it is for">
              <span className="filters__label">{t.who}</span>
              <button
                type="button"
                className={`filterbar__chip ${audience === 'all' ? 'is-on' : ''}`}
                aria-pressed={audience === 'all'}
                onClick={() => setAudience('all')}
              >
                {t.whoAll}
              </button>
              {(Object.keys(AUDIENCES) as Audience[]).map((a, i) => (
                <button
                  key={a}
                  type="button"
                  className={`filterbar__chip ${audience === a ? 'is-on' : ''}`}
                  aria-pressed={audience === a}
                  onClick={() => setAudience(a)}
                  style={rot('hair', i % 2 === 0 ? -1 : 1)}
                >
                  {vocab.resourceAudience(a)}
                </button>
              ))}
            </div>
          </div>

          <p className="filterbar__count" aria-live="polite">
            {list.length} {list.length === 1 ? t.one : t.many}
          </p>

          <div className="resources-grid">
            {list.map((r, i) => (
              <article
                key={r.id}
                className={`res-card res-card--${r.card}`}
                style={rot(i % 3 === 0 ? 'nudge' : 'hair', i % 2 === 0 ? 1 : -1)}
              >
                {r.badge && (
                  <span className="res-card__badge">
                    <Sticker color={r.badge === 'Start here' ? 'red' : 'yellow'} flat>
                      {r.badge}
                    </Sticker>
                  </span>
                )}
                <span className="res-card__format">{vocab.format(r.format).verb}</span>
                <h3 className="res-card__title">{r.title}</h3>
                <p className="res-card__blurb">
                  <Rich text={r.blurb} />
                </p>
                <div className="res-card__foot">
                  <span className="res-card__audience">
                    {r.audience.map((a) => vocab.resourceAudience(a)).join(' · ')}
                  </span>
                  {r.link ? (
                    <a
                      className="res-card__status res-card__status--link"
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.visit}
                    </a>
                  ) : r.status === 'listed' ? (
                    <span className="res-card__status res-card__status--listed">{t.listed}</span>
                  ) : (
                    <span className="res-card__status">{t.openCall}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="ink" id="suggest" torn="top" className="resources-suggest">
        <div className="wrap wrap--wide resources-suggest__inner">
          <div>
            <SectionHead number="02" kicker={c.suggest.kicker} />
            <EditorialHeadline size={1}>
              <Rich text={c.suggest.headline} />
            </EditorialHeadline>
            <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
              {c.suggest.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </div>
          <div className="resources-suggest__stickers">
            {(Object.keys(FORMATS) as ResourceFormat[]).map((f, i) => (
              <Sticker
                key={f}
                color={(['yellow', 'pink', 'acid', 'peach', 'lavender', 'green'] as const)[i % 6]}
                large
                tiltDir={i % 2 === 0 ? 1 : -1}
              >
                {vocab.format(f).verb}
              </Sticker>
            ))}
            <a href={contactMailto(c.suggest.subject)} className="btn btn--yellow btn--lg">
              {c.suggest.cta}
            </a>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
