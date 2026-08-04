import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  EditorialHeadline,
  EventStatusBadge,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
} from '../components/zine'
import {
  AUDIENCE_META,
  EVENT_TYPES,
  STATUS_META,
  formatEventDate,
  getEvent,
} from '../data/events'
import { getRegion } from '../data/regions'
import { AGE_CHOICES, CONNECTION_CHOICES, MINOR_AGES, MINOR_NOTICE } from '../data/joinForm'
import { GUIDELINES_CHECKBOX } from '../data/community'
import { NotFound } from './NotFound'

function RegistrationForm({
  eventSlug,
  audience,
  needsFood,
  guardianConsentUnder,
  open,
}: {
  eventSlug: string
  audience: keyof typeof AUDIENCE_META
  needsFood?: boolean
  guardianConsentUnder?: number
  open: boolean
}) {
  const [age, setAge] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)
  const isMinor = MINOR_AGES.has(age)

  if (done) {
    return (
      <PaperCard className="reg-done" tilt="nudge" tiltDir={-1} shadow="slab" data-tone="acid" style={{ background: 'var(--surface)' }}>
        <TapeStrip position="top-center" variant="clear" width={130} />
        <EditorialHeadline size={2}>
          {open ? 'You’re on the list.' : 'We’ll let you know.'}
        </EditorialHeadline>
        <p style={{ marginTop: 'var(--s-4)' }}>
          {open
            ? 'Look for a confirmation email. If anything changes about the venue or timing, we will tell you before you travel.'
            : 'This one is not confirmed yet. As soon as the date and venue are locked in, you will hear from us — and you can change your mind at any point.'}
        </p>
        <div style={{ marginTop: 'var(--s-5)', display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <Link to="/events" className="btn btn--ghost">
            Other events
          </Link>
          <Link to="/join" className="btn btn--red">
            Join DOKADS properly
          </Link>
        </div>
      </PaperCard>
    )
  }

  return (
    <form
      className="reg-form"
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
      aria-labelledby={`reg-${eventSlug}`}
    >
      <h3 id={`reg-${eventSlug}`} className="reg-form__head">
        {open ? 'Save me a spot' : 'Tell me when this is confirmed'}
      </h3>

      {audience === 'dokads only' && (
        <p className="reg-form__notice">{AUDIENCE_META['dokads only'].detail}</p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="reg-first">First name</label>
          <input id="reg-first" name="first" type="text" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="reg-last">
            Last name or initial <span className="field__opt">optional</span>
          </label>
          <input id="reg-last" name="last" type="text" autoComplete="family-name" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="reg-email">Email</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" required />
        <p className="field__help">Used for this event. Nothing else unless you tick the box below.</p>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="reg-age">
            Age range <span className="field__opt">optional</span>
          </label>
          <select id="reg-age" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Prefer not to say</option>
            {AGE_CHOICES.filter((c) => c.value !== 'no-answer').map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="field__help">We never ask for an exact date of birth.</p>
        </div>
        <div className="field">
          <label htmlFor="reg-city">
            City or region <span className="field__opt">optional</span>
          </label>
          <input id="reg-city" name="city" type="text" autoComplete="address-level2" />
        </div>
      </div>

      {isMinor && (
        <p className="reg-form__minor" role="status">
          {MINOR_NOTICE}
          {guardianConsentUnder && (
            <>
              {' '}
              For this event, anyone under {guardianConsentUnder} needs a parent or guardian to
              confirm by email first — we will send you what they need.
            </>
          )}
        </p>
      )}

      <div className="field">
        <label htmlFor="reg-connection">
          Your connection to the DoKAD community <span className="field__opt">optional</span>
        </label>
        <select id="reg-connection" name="connection" defaultValue="">
          <option value="">Prefer not to say</option>
          {CONNECTION_CHOICES.filter((c) => c.value !== 'no-answer').map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="reg-access">
          Accessibility or accommodation request <span className="field__opt">optional</span>
        </label>
        <textarea id="reg-access" name="access" rows={2} />
        <p className="field__help">
          Step-free access, a quieter corner, captions, anything at all. Ask and we will sort it.
        </p>
      </div>

      {needsFood && (
        <div className="field">
          <label htmlFor="reg-diet">
            Dietary considerations <span className="field__opt">optional</span>
          </label>
          <input id="reg-diet" name="diet" type="text" />
        </div>
      )}

      <div className="check">
        <input id="reg-updates" name="updates" type="checkbox" />
        <label htmlFor="reg-updates">
          Send me updates about DOKADS events. <span className="field__opt">optional</span>
        </label>
      </div>

      <div className="check">
        <input
          id="reg-guidelines"
          name="guidelines"
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label htmlFor="reg-guidelines">
          {GUIDELINES_CHECKBOX} <Link to="/guidelines">Read them</Link>
        </label>
      </div>

      <button type="submit" className="btn btn--red btn--lg btn--block">
        {open ? 'Register' : 'Keep me posted'}
      </button>

      <p className="reg-form__foot">
        This is a demonstration form — it does not send anywhere yet. Once it does, you will be
        able to delete everything you gave us by replying to any email.
      </p>
    </form>
  )
}

export function EventPage() {
  const { slug = '' } = useParams()
  const event = getEvent(slug)
  if (!event) return <NotFound />

  const status = STATUS_META[event.status]
  const region = getRegion(event.region)
  const registrationOpen =
    event.status === 'registration open' || event.status === 'waitlist'

  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="event-head">
        <div className="wrap wrap--wide">
          <p className="article-head__crumbs">
            <Link to="/events">Events</Link> <span aria-hidden="true">/</span>{' '}
            {EVENT_TYPES[event.type]}
          </p>

          <div className="event-head__badges">
            <EventStatusBadge status={event.status} />
            <IssueLabel prefix="DOKADS" issue="001" />
          </div>

          <EditorialHeadline size="display" className="event-head__title">
            {event.title}
          </EditorialHeadline>

          <p className="lead">{event.blurb}</p>

          <div className="event-head__ticket">
            <dl className="ticket">
              <div>
                <dt>Date</dt>
                <dd>{formatEventDate(event.date, { long: true })}</dd>
              </div>
              {event.backupDate && (
                <div>
                  <dt>Backup date</dt>
                  <dd>{formatEventDate(event.backupDate, { long: true })}</dd>
                </div>
              )}
              <div>
                <dt>Time</dt>
                <dd>
                  {event.time} {event.timezone}
                </dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>
                  {event.location}
                  <br />
                  <span className="ticket__sub">{event.venueKind}</span>
                </dd>
              </div>
              <div>
                <dt>Who it’s for</dt>
                <dd>{AUDIENCE_META[event.audience].label}</dd>
              </div>
              <div>
                <dt>Ages</dt>
                <dd>{event.agePolicy}</dd>
              </div>
              <div>
                <dt>Cost</dt>
                <dd>{event.cost}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>
                  {region ? (
                    <Link to={`/regions/${region.slug}`}>{region.name}</Link>
                  ) : (
                    'Online'
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </ZineSection>

      {/* what is and is not settled */}
      {event.tentativeNotes && (
        <ZineSection tone="yellow" className="event-tentative">
          <div className="wrap wrap--wide">
            <SectionHead number="!" kicker={`${status.label} — here is what that means`} />
            <div className="event-tentative__grid">
              <ul className="event-tentative__list">
                {event.tentativeNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <HandwrittenNote color="red" tiltDir={1}>
                we’ll tell you the moment it’s real
              </HandwrittenNote>
            </div>
          </div>
        </ZineSection>
      )}

      {/* rules + who it's for */}
      <ZineSection tone="bright" torn="both" className="event-detail">
        <div className="wrap wrap--wide event-detail__inner">
          <div className="event-detail__body">
            <SectionHead number="01" kicker="Who this is for" />
            <p className="prose">{AUDIENCE_META[event.audience].detail}</p>

            <h3 className="event-detail__sub">The rules for this one</h3>
            <ul className="event-detail__rules">
              <li>
                <strong>Plus-ones:</strong>{' '}
                {event.rules.plusOnes
                  ? 'Bring someone if you like.'
                  : 'Not for this one — we are keeping the first gatherings small enough to actually talk.'}
              </li>
              {event.rules.capacity && (
                <li>
                  <strong>Capacity:</strong> {event.rules.capacity} people.
                </li>
              )}
              <li>
                <strong>Waitlist:</strong>{' '}
                {event.rules.waitlist ? 'Yes, if it fills up.' : 'No waitlist.'}
              </li>
              {event.rules.minAge && (
                <li>
                  <strong>Minimum age:</strong> {event.rules.minAge}.
                </li>
              )}
              {event.rules.guardianConsentUnder && (
                <li>
                  <strong>Under {event.rules.guardianConsentUnder}:</strong> a parent or
                  guardian needs to confirm by email.
                </li>
              )}
              {event.rules.deadline && (
                <li>
                  <strong>Register by:</strong> {formatEventDate(event.rules.deadline)}.
                </li>
              )}
              {event.rules.perk && (
                <li>
                  <strong>Hoping to offer:</strong> {event.rules.perk}.{' '}
                  {event.status === 'tentative' && (
                    <em>Not confirmed — do not count on it yet.</em>
                  )}
                </li>
              )}
            </ul>

            <PaperCard className="event-detail__guidelines" tilt="hair" shadow="lift">
              <p>
                <strong>Everyone who registers agrees to the community guidelines.</strong> They
                are short, and they are mostly about not making anyone justify their own family.
              </p>
              <Link to="/guidelines" className="btn btn--ghost" style={{ marginTop: 'var(--s-3)' }}>
                Read the guidelines
              </Link>
            </PaperCard>
          </div>

          <div className="event-detail__form">
            <RegistrationForm
              eventSlug={event.slug}
              audience={event.audience}
              needsFood={event.needsFoodInfo}
              guardianConsentUnder={event.rules.guardianConsentUnder}
              open={registrationOpen}
            />
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="ink" className="event-close">
        <div className="wrap event-close__inner">
          <EditorialHeadline size={2}>Not this one?</EditorialHeadline>
          <p className="lead">There will be others, and you can help decide what they are.</p>
          <div className="event-close__ctas">
            <Link to="/events" className="btn btn--yellow">
              All events
            </Link>
            <Sticker to="/join" color="paper" large>
              Tell us what to run
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
