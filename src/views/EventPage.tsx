import Link from 'next/link'
import { notFound } from 'next/navigation'
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
import { RegistrationForm } from '../components/forms/RegistrationForm'

export function EventPage({ slug }: { slug: string }) {
  const event = getEvent(slug)
  if (!event) notFound()

  const status = STATUS_META[event.status]
  const region = getRegion(event.region)
  const registrationOpen =
    event.status === 'registration open' || event.status === 'waitlist'

  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="event-head">
        <div className="wrap wrap--wide">
          <p className="article-head__crumbs">
            <Link href="/events">Events</Link> <span aria-hidden="true">/</span>{' '}
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
                    <Link href={`/regions/${region.slug}`}>{region.name}</Link>
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
              <Link href="/guidelines" className="btn btn--ghost" style={{ marginTop: 'var(--s-3)' }}>
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
            <Link href="/events" className="btn btn--yellow">
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
