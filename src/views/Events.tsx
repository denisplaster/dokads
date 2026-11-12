'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  EditorialHeadline,
  FlyerEventCard,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { AUDIENCE_META, formatEventDate } from '../data/events'
import type { DokEvent, EventAudience, EventType } from '../data/events'
import type { Region } from '../data/regions'
import { contactMailto } from '../lib/site-mode'
import { Rich } from '../components/Rich'
import { vocab } from '../content/vocab'
import type { Copy } from '../content/copy'

export type EventsText = Copy<'events'>

type FormatFilter = 'all' | 'online' | 'in person'

export function Events({
  upcoming,
  past,
  regions,
  text: c,
}: {
  upcoming: DokEvent[]
  past: DokEvent[]
  regions: Region[]
  text: EventsText
}) {
  const w = c.wall
  const all = upcoming
  const regionName = (slug: string) => regions.find((r) => r.slug === slug)?.name ?? 'Online'
  const [type, setType] = useState<EventType | 'all'>('all')
  const [format, setFormat] = useState<FormatFilter>('all')
  const [audience, setAudience] = useState<EventAudience | 'all'>('all')

  const list = useMemo(
    () =>
      all.filter(
        (e) =>
          (type === 'all' || e.type === type) &&
          (format === 'all' || e.format === format) &&
          (audience === 'all' || e.audience === audience),
      ),
    [all, type, format, audience],
  )

  const usedTypes = Array.from(new Set(all.map((e) => e.type)))
  // the most recent thing that actually happened gets the feature slot
  const latest = past[0]
  const earlier = past.slice(1)

  return (
    <>
      <ZineSection tone="green" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={all.length ? c.hero.leadUpcoming : c.hero.leadNone} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="ink" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* status key — the honesty layer */}
      <ZineSection tone="paper" tight className="events-key">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift">
            <TapeStrip position="top-right" variant="kraft" width={110} />
            <span className="eyebrow">{c.key.eyebrow}</span>
            <p>
              <Rich text={c.key.body} />
            </p>
            <ul className="events-key__list">
              {(
                ['tentative', 'registration opening soon', 'registration open', 'waitlist', 'completed'] as const
              ).map((s, i) => (
                <li key={s} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                  <span className={`status-badge status-badge--${s.replace(/\s+/g, '-')}`}>
                    <span className="status-badge__dot" aria-hidden="true" />
                    {vocab.status(s).label}
                  </span>
                  <span className="events-key__note">{vocab.status(s).note}</span>
                </li>
              ))}
            </ul>
          </PaperCard>
        </div>
      </ZineSection>

      {/* the most recent event that happened */}
      {latest && (
        <ZineSection tone="yellow" torn="both" className="events-flagship">
          <div className="wrap wrap--wide events-flagship__inner">
            <div>
              <SectionHead number="01" kicker={c.latest.kicker} />
              <EditorialHeadline size={1}>{latest.title}</EditorialHeadline>
              <p className="lead" style={{ marginTop: 'var(--s-4)' }}>
                {latest.recap ?? latest.blurb}
              </p>
              <dl className="events-flagship__facts">
                <div>
                  <dt>{c.latest.when}</dt>
                  <dd>{formatEventDate(latest.date, { long: true })}</dd>
                </div>
                <div>
                  <dt>{c.latest.time}</dt>
                  <dd>
                    {latest.time} {latest.timezone}
                  </dd>
                </div>
                <div>
                  <dt>{c.latest.where}</dt>
                  <dd>{latest.location}</dd>
                </div>
                <div>
                  <dt>{c.latest.who}</dt>
                  <dd>
                    {vocab.audience(latest.audience).label} · {latest.agePolicy}
                  </dd>
                </div>
                {latest.host && (
                  <div>
                    <dt>{c.latest.host}</dt>
                    <dd>{latest.host.name}</dd>
                  </div>
                )}
              </dl>
              <div className="events-flagship__ctas">
                <Link href={`/events/${latest.slug}`} className="btn btn--red btn--lg">
                  {c.latest.cta}
                </Link>
                <a href={contactMailto(c.latest.nextSubject)} className="btn btn--ghost">
                  {c.latest.next}
                </a>
              </div>
            </div>
            <div className="events-flagship__card">
              <Link href={`/events/${latest.slug}`} className="home-events__link">
                <FlyerEventCard event={latest} index={1} stub />
              </Link>
              <HandwrittenNote color="red" tiltDir={1} className="events-flagship__scrawl">
                {c.latest.scrawl}
              </HandwrittenNote>
            </div>
          </div>
        </ZineSection>
      )}

      {/* the wall */}
      <ZineSection tone="paper" className="events-wall">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker={w.kicker} />

          {all.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              {w.empty.map((para, i) => (
                <p key={para.slice(0, 32)} style={i ? { marginTop: 'var(--s-3)' } : undefined}>
                  <Rich text={para} />
                </p>
              ))}
              <a
                href={contactMailto(w.ideaSubject)}
                className="btn btn--red"
                style={{ marginTop: 'var(--s-4)' }}
              >
                {w.emptyCta}
              </a>
            </PaperCard>
          ) : (
          <>
          <div className="filters">
            <div className="filters__row" role="group" aria-label="Filter by event type">
              <span className="filters__label">{w.filterType}</span>
              <button
                type="button"
                className={`filterbar__chip ${type === 'all' ? 'is-on' : ''}`}
                aria-pressed={type === 'all'}
                onClick={() => setType('all')}
              >
                {w.filterAll}
              </button>
              {usedTypes.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  className={`filterbar__chip ${type === t ? 'is-on' : ''}`}
                  aria-pressed={type === t}
                  onClick={() => setType(t)}
                  style={rot('hair', i % 2 === 0 ? 1 : -1)}
                >
                  {vocab.eventType(t)}
                </button>
              ))}
            </div>

            <div className="filters__row" role="group" aria-label="Filter by format">
              <span className="filters__label">{w.filterFormat}</span>
              {(['all', 'online', 'in person'] as FormatFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filterbar__chip ${format === f ? 'is-on' : ''}`}
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                >
                  {f === 'all' ? w.filterAll : f === 'online' ? w.formatOnline : w.formatInPerson}
                </button>
              ))}
            </div>

            <div className="filters__row" role="group" aria-label="Filter by who it is for">
              <span className="filters__label">{w.filterWho}</span>
              <button
                type="button"
                className={`filterbar__chip ${audience === 'all' ? 'is-on' : ''}`}
                aria-pressed={audience === 'all'}
                onClick={() => setAudience('all')}
              >
                {w.filterAll}
              </button>
              {(Object.keys(AUDIENCE_META) as EventAudience[]).map((a, i) => (
                <button
                  key={a}
                  type="button"
                  className={`filterbar__chip ${audience === a ? 'is-on' : ''}`}
                  aria-pressed={audience === a}
                  onClick={() => setAudience(a)}
                  style={rot('hair', i % 2 === 0 ? -1 : 1)}
                >
                  {vocab.audience(a).label}
                </button>
              ))}
            </div>
          </div>

          <p className="filterbar__count" aria-live="polite">
            {list.length} {list.length === 1 ? w.one : w.many}
          </p>

          {list.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              <p>
                <Rich text={w.noMatch} />
              </p>
              <a
                href={contactMailto(w.ideaSubject)}
                className="btn btn--red"
                style={{ marginTop: 'var(--s-4)' }}
              >
                {w.noMatchCta}
              </a>
            </PaperCard>
          ) : (
            <div className="events-wall__grid">
              {list.map((e, i) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="home-events__link">
                  <FlyerEventCard event={e} index={i} />
                  <span className="events-wall__region">
                    {regionName(e.region)}
                  </span>
                </Link>
              ))}
            </div>
          )}
          </>
          )}

          {earlier.length > 0 && (
            <>
              <h3 className="event-detail__sub" style={{ marginTop: 'var(--s-8)' }}>
                {w.earlier}
              </h3>
              <div className="events-wall__grid">
                {earlier.map((e, i) => (
                  <Link key={e.id} href={`/events/${e.slug}`} className="home-events__link">
                    <FlyerEventCard event={e} index={i + 2} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </ZineSection>

      {/* venues note */}
      <ZineSection tone="blue" torn="top" className="events-venues">
        <div className="wrap wrap--wide events-venues__inner">
          <div>
            <SectionHead number="03" kicker={c.venues.kicker} />
            <div className="prose">
              {c.venues.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </div>
          <div className="events-venues__stickers">
            {c.venues.stickers.map((v, i) => (
              <Sticker
                key={v}
                color={
                  (['yellow', 'paper', 'pink', 'acid', 'peach', 'lavender', 'green'] as const)[i % 7]
                }
                large
                tiltDir={i % 2 === 0 ? 1 : -1}
              >
                {v}
              </Sticker>
            ))}
          </div>
        </div>
      </ZineSection>
    </>
  )
}
