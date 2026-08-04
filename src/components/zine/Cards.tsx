import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { DokEvent, EventStatus } from '../../data/events'
import { AUDIENCE_META, EVENT_TYPES, STATUS_META } from '../../data/events'
import type { Story } from '../../data/stories'
import { STORY_KINDS } from '../../data/stories'
import { CollageFrame } from './CollageFrame'
import { CategorySticker, Sticker } from './Sticker'
import { TapeStrip, rot } from './Paper'

/* ------------------------------------------------------------------ */
/* FlyerEventCard                                                      */
/* ------------------------------------------------------------------ */

const FLYER_TONES = ['yellow', 'blue', 'red', 'pink', 'acid', 'lavender'] as const

/** Status badge — required on every surface an event appears on. */
export function EventStatusBadge({ status }: { status: EventStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className={`status-badge status-badge--${status.replace(/\s+/g, '-')}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {meta.label}
    </span>
  )
}

export function FlyerEventCard({
  event,
  index = 0,
  stub = false,
}: {
  event: DokEvent
  index?: number
  stub?: boolean
}) {
  const tone = FLYER_TONES[index % FLYER_TONES.length]
  const d = new Date(`${event.date}T12:00:00`)
  const day = d.toLocaleDateString('en-US', { day: 'numeric' })
  const mo = d.toLocaleDateString('en-US', { month: 'short' })
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const provisional = event.status === 'draft' || event.status === 'tentative'

  return (
    <article
      className={`flyer ${stub ? 'flyer--stub' : ''} ${provisional ? 'flyer--provisional' : ''}`}
      data-tone={tone}
      style={{
        ...rot('nudge', index % 2 === 0 ? 1 : -1),
        background: 'var(--surface)',
        color: 'var(--on-surface)',
      }}
    >
      {index % 3 === 0 && <TapeStrip position="top-right" variant="clear" width={90} />}
      <div className="flyer__status">
        <EventStatusBadge status={event.status} />
      </div>
      <div className="flyer__date">
        <span className="flyer__day">{day}</span>
        <span className="flyer__mo">{mo}</span>
        <span className="flyer__yr">{d.getFullYear()}</span>
      </div>
      <div className="flyer__body">
        <div className="flyer__tags">
          <span className="cat-sticker">{EVENT_TYPES[event.type]}</span>
          <span className="cat-sticker">{AUDIENCE_META[event.audience].label}</span>
          <span className="cat-sticker">{event.format === 'online' ? 'Online' : 'In person'}</span>
          {event.cost.toLowerCase().startsWith('free') && (
            <span className="cat-sticker cat--question">Free</span>
          )}
        </div>
        <h3 className="flyer__title">{event.title}</h3>
        <p style={{ fontSize: 'var(--t-small)', lineHeight: 1.45 }}>{event.blurb}</p>
        <dl className="flyer__meta">
          <div className="flyer__row">
            <dt>When</dt>
            <dd>
              {weekday} · {event.time} {event.timezone}
            </dd>
          </div>
          <div className="flyer__row">
            <dt>Where</dt>
            <dd>{event.location}</dd>
          </div>
          <div className="flyer__row">
            <dt>Ages</dt>
            <dd>{event.agePolicy}</dd>
          </div>
        </dl>
        {provisional && (
          <p className="flyer__provisional">
            Not confirmed yet — details can still change.
          </p>
        )}
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* ZineArticleCard                                                     */
/* ------------------------------------------------------------------ */

export type CardLayout = 'lead' | 'standard' | 'boxed' | 'quote' | 'note' | 'text'

export function ZineArticleCard({
  story,
  layout = 'standard',
  index = 0,
  style,
}: {
  story: Story
  layout?: CardLayout
  index?: number
  style?: CSSProperties
}) {
  const kind = STORY_KINDS[story.kind]
  const dir: 1 | -1 = index % 2 === 0 ? 1 : -1

  if (layout === 'quote') {
    return (
      <Link
        to={`/stories/${story.slug}`}
        className="zcard zcard--quote"
        style={style}
        data-tone="ink"
      >
        <span className="pullquote__mark" aria-hidden="true">
          “
        </span>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
            lineHeight: 1.04,
            textTransform: 'uppercase',
          }}
        >
          {story.pullquote ?? story.dek}
        </p>
        <span className="zcard__byline" style={{ opacity: 0.85 }}>
          <span>{story.byline}</span>
          <span>{kind.label}</span>
        </span>
      </Link>
    )
  }

  if (layout === 'note') {
    return (
      <Link
        to={`/stories/${story.slug}`}
        className="zcard zcard--note"
        style={{ ...rot('nudge', dir), ...style }}
      >
        <span className="eyebrow">{kind.label}</span>
        <h3
          className="zcard__title"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 800, textTransform: 'none' }}
        >
          {story.title}
        </h3>
        <p className="zcard__dek">{story.dek}</p>
        <span className="zcard__byline">
          <span>{story.byline}</span>
          <span>{story.readingTime} min</span>
        </span>
      </Link>
    )
  }

  if (layout === 'text') {
    return (
      <Link to={`/stories/${story.slug}`} className="zcard" style={style}>
        <span className="zcard__kicker">
          <CategorySticker kind={story.kind} label={kind.label} />
        </span>
        <h3 className="zcard__title">{story.title}</h3>
        <p className="zcard__dek">{story.dek}</p>
        <span className="zcard__byline">
          <span>{story.byline}</span>
          <span>{story.readingTime} min read</span>
        </span>
      </Link>
    )
  }

  const isLead = layout === 'lead'

  return (
    <Link
      to={`/stories/${story.slug}`}
      className={`zcard ${layout === 'boxed' ? 'zcard--boxed' : ''}`}
      style={style}
    >
      <div className="zcard__frame">
        <CollageFrame
          seed={story.slug}
          variant={story.art}
          ratio={isLead ? '16 / 9' : '4 / 3'}
        />
      </div>
      <span className="zcard__kicker">
        <CategorySticker kind={story.kind} label={kind.label} />
        {story.location && <span className="eyebrow">{story.location}</span>}
      </span>
      <h3
        className="zcard__title"
        style={isLead ? { fontSize: 'clamp(1.9rem, 4vw, 3rem)' } : undefined}
      >
        {story.title}
      </h3>
      <p className="zcard__dek" style={isLead ? { fontSize: 'var(--t-lead)' } : undefined}>
        {story.dek}
      </p>
      <span className="zcard__byline">
        <span>{story.byline}</span>
        <span>{story.readingTime} min read</span>
        {isLead && <Sticker color="red">Read this</Sticker>}
      </span>
    </Link>
  )
}
