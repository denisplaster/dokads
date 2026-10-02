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
import { AUDIENCE_META, EVENT_TYPES, STATUS_META, formatEventDate } from '../data/events'
import type { DokEvent, EventAudience, EventType } from '../data/events'
import type { Region } from '../data/regions'
import { contactMailto } from '../lib/site-mode'

type FormatFilter = 'all' | 'online' | 'in person'

export function Events({
  upcoming,
  past,
  regions,
}: {
  upcoming: DokEvent[]
  past: DokEvent[]
  regions: Region[]
}) {
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
            Coming{' '}
            <br />
            up.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            {all.length
              ? 'Coffee meetups, online gatherings, guided conversations, and the occasional workshop. Small, mostly free, and shaped by whoever turns up.'
              : 'Nothing is on the calendar right now. The first DoKAD meetup happened in September — here is how that went, and how to hear about the next one first.'}
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="ink" tiltDir={1}>
              weekends + evenings, mostly — you told us
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* status key — the honesty layer */}
      <ZineSection tone="paper" tight className="events-key">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift">
            <TapeStrip position="top-right" variant="kraft" width={110} />
            <span className="eyebrow">Read the label</span>
            <p>
              Every event here shows where it actually stands. A real plan can still be
              tentative — date or venue not settled — and when it is, it says so. Ideas that are
              not plans yet are not listed at all.
            </p>
            <ul className="events-key__list">
              {(
                ['tentative', 'registration opening soon', 'registration open', 'waitlist', 'completed'] as const
              ).map((s, i) => (
                <li key={s} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                  <span className={`status-badge status-badge--${s.replace(/\s+/g, '-')}`}>
                    <span className="status-badge__dot" aria-hidden="true" />
                    {STATUS_META[s].label}
                  </span>
                  <span className="events-key__note">{STATUS_META[s].note}</span>
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
              <SectionHead number="01" kicker="Last time" />
              <EditorialHeadline size={1}>{latest.title}</EditorialHeadline>
              <p className="lead" style={{ marginTop: 'var(--s-4)' }}>
                {latest.recap ?? latest.blurb}
              </p>
              <dl className="events-flagship__facts">
                <div>
                  <dt>When</dt>
                  <dd>{formatEventDate(latest.date, { long: true })}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>
                    {latest.time} {latest.timezone}
                  </dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>{latest.location}</dd>
                </div>
                <div>
                  <dt>Who</dt>
                  <dd>
                    {AUDIENCE_META[latest.audience].label} · {latest.agePolicy}
                  </dd>
                </div>
                {latest.host && (
                  <div>
                    <dt>Hosted by</dt>
                    <dd>{latest.host.name}</dd>
                  </div>
                )}
              </dl>
              <div className="events-flagship__ctas">
                <Link href={`/events/${latest.slug}`} className="btn btn--red btn--lg">
                  About this one
                </Link>
                <a
                  href={contactMailto('Interested in the next DoKAD meetup')}
                  className="btn btn--ghost"
                >
                  Tell us you want the next one
                </a>
              </div>
            </div>
            <div className="events-flagship__card">
              <Link href={`/events/${latest.slug}`} className="home-events__link">
                <FlyerEventCard event={latest} index={1} stub />
              </Link>
              <HandwrittenNote color="red" tiltDir={1} className="events-flagship__scrawl">
                the first one happened!
              </HandwrittenNote>
            </div>
          </div>
        </ZineSection>
      )}

      {/* the wall */}
      <ZineSection tone="paper" className="events-wall">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker="Coming up" />

          {all.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              <p>
                <strong>Nothing scheduled right now.</strong> When the next gathering is real —
                date, place and host confirmed — it goes here first. Ideas that are not plans yet
                do not get listed.
              </p>
              <p style={{ marginTop: 'var(--s-3)' }}>
                Want a say in what happens next? Tell us what would suit you: a time, a kind of
                gathering, a part of the world.
              </p>
              <a
                href={contactMailto('Event idea for DOKADS')}
                className="btn btn--red"
                style={{ marginTop: 'var(--s-4)' }}
              >
                Email us an idea
              </a>
            </PaperCard>
          ) : (
          <>
          <div className="filters">
            <div className="filters__row" role="group" aria-label="Filter by event type">
              <span className="filters__label">Type</span>
              <button
                type="button"
                className={`filterbar__chip ${type === 'all' ? 'is-on' : ''}`}
                aria-pressed={type === 'all'}
                onClick={() => setType('all')}
              >
                All
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
                  {EVENT_TYPES[t]}
                </button>
              ))}
            </div>

            <div className="filters__row" role="group" aria-label="Filter by format">
              <span className="filters__label">Format</span>
              {(['all', 'online', 'in person'] as FormatFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filterbar__chip ${format === f ? 'is-on' : ''}`}
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>

            <div className="filters__row" role="group" aria-label="Filter by who it is for">
              <span className="filters__label">Who it’s for</span>
              <button
                type="button"
                className={`filterbar__chip ${audience === 'all' ? 'is-on' : ''}`}
                aria-pressed={audience === 'all'}
                onClick={() => setAudience('all')}
              >
                All
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
                  {AUDIENCE_META[a].label}
                </button>
              ))}
            </div>
          </div>

          <p className="filterbar__count" aria-live="polite">
            {list.length} {list.length === 1 ? 'event' : 'events'}
          </p>

          {list.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              <p>
                <strong>Nothing matches that combination yet.</strong> Tell us what you want and
                we will try to make it exist.
              </p>
              <a
                href={contactMailto('Event idea for DOKADS')}
                className="btn btn--red"
                style={{ marginTop: 'var(--s-4)' }}
              >
                Request an event
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
                Earlier
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
            <SectionHead number="03" kicker="On venues" />
            <div className="prose">
              <p>
                A lot of adoptee and diaspora events default to breweries. That does not work
                for everyone here — some of you are under 21, some do not drink, and some just
                want to hear the person across the table.
              </p>
              <p>
                So the default is coffee shops, libraries, community centres, parks,
                restaurants, universities, and video calls. Alcohol-serving venues are an
                option, not the baseline.
              </p>
            </div>
          </div>
          <div className="events-venues__stickers">
            {[
              'Coffee shop',
              'Library',
              'Community center',
              'Park',
              'Restaurant',
              'University',
              'Online',
            ].map((v, i) => (
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
