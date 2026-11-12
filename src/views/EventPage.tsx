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
import { formatEventDate } from '../data/events'
import type { DokEvent } from '../data/events'
import type { Region } from '../data/regions'
import { RegistrationForm } from '../components/forms/RegistrationForm'
import { CONTACT_EMAIL, collectsData } from '../lib/site-mode'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'
import { vocab } from '../content/vocab'

export function EventPage({ event, region }: { event: DokEvent; region?: Region }) {
  const c = copy('events')
  const d = c.eventPage
  const r = c.eventRules
  const side = c.eventSide
  const status = vocab.status(event.status)
  const audience = vocab.audience(event.audience)
  const registrationOpen =
    event.status === 'registration open' || event.status === 'waitlist'
  // sign-up rules, the guidelines-on-registration note and any sign-up route
  // are meaningless once an event is over
  const isPast = event.status === 'completed' || event.status === 'cancelled'

  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="event-head">
        <div className="wrap wrap--wide">
          <p className="article-head__crumbs">
            <Link href="/events">{d.crumb}</Link> <span aria-hidden="true">/</span>{' '}
            {vocab.eventType(event.type)}
          </p>

          <div className="event-head__badges">
            <EventStatusBadge status={event.status} />
            <IssueLabel />
          </div>

          <EditorialHeadline size="display" className="event-head__title">
            {event.title}
          </EditorialHeadline>

          <p className="lead">{event.blurb}</p>

          <div className="event-head__ticket">
            <dl className="ticket">
              <div>
                <dt>{d.date}</dt>
                <dd>{formatEventDate(event.date, { long: true })}</dd>
              </div>
              {event.backupDate && (
                <div>
                  <dt>{d.backupDate}</dt>
                  <dd>{formatEventDate(event.backupDate, { long: true })}</dd>
                </div>
              )}
              <div>
                <dt>{d.time}</dt>
                <dd>
                  {event.time} {event.timezone}
                </dd>
              </div>
              <div>
                <dt>{d.where}</dt>
                <dd>
                  {event.location}
                  <br />
                  <span className="ticket__sub">{event.venueKind}</span>
                </dd>
              </div>
              <div>
                <dt>{d.who}</dt>
                <dd>{audience.label}</dd>
              </div>
              <div>
                <dt>{d.ages}</dt>
                <dd>{event.agePolicy}</dd>
              </div>
              <div>
                <dt>{d.cost}</dt>
                <dd>{event.cost}</dd>
              </div>
              <div>
                <dt>{d.region}</dt>
                <dd>
                  {region ? (
                    <Link href={`/regions/${region.slug}`}>{region.name}</Link>
                  ) : (
                    d.online
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </ZineSection>

      {/* what is and is not settled */}
      {event.tentativeNotes?.length ? (
        <ZineSection tone="yellow" className="event-tentative">
          <div className="wrap wrap--wide">
            <SectionHead number="!" kicker={`${status.label} ${d.tentativeSuffix}`} />
            <div className="event-tentative__grid">
              <ul className="event-tentative__list">
                {event.tentativeNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <HandwrittenNote color="red" tiltDir={1}>
                {d.tentativeNote}
              </HandwrittenNote>
            </div>
          </div>
        </ZineSection>
      ) : null}

      {/* rules + who it's for */}
      <ZineSection tone="bright" torn="both" className="event-detail">
        <div className="wrap wrap--wide event-detail__inner">
          <div className="event-detail__body">
            <SectionHead number="01" kicker={d.whoKicker} />
            <p className="prose">
              <Rich text={audience.detail} />
            </p>

            {!isPast && (
            <>
            <h3 className="event-detail__sub">{r.heading}</h3>
            <ul className="event-detail__rules">
              <li>
                <strong>{r.plusOnes}</strong> {event.rules.plusOnes ? r.plusYes : r.plusNo}
              </li>
              {event.rules.capacity && (
                <li>
                  <strong>{r.capacity}</strong> {event.rules.capacity} {r.people}
                </li>
              )}
              <li>
                <strong>{r.waitlist}</strong> {event.rules.waitlist ? r.waitYes : r.waitNo}
              </li>
              {event.rules.minAge && (
                <li>
                  <strong>{r.minAge}</strong> {event.rules.minAge}.
                </li>
              )}
              {event.rules.guardianConsentUnder && (
                <li>
                  <strong>
                    {r.under} {event.rules.guardianConsentUnder}:
                  </strong>{' '}
                  {r.guardian}
                </li>
              )}
              {event.rules.deadline && (
                <li>
                  <strong>{r.deadline}</strong> {formatEventDate(event.rules.deadline)}.
                </li>
              )}
              {event.rules.perk && (
                <li>
                  <strong>{r.perk}</strong> {event.rules.perk}.{' '}
                  {event.status === 'tentative' && <em>{r.perkTentative}</em>}
                </li>
              )}
            </ul>

            <PaperCard className="event-detail__guidelines" tilt="hair" shadow="lift">
              <p>
                <Rich text={r.guidelines} />
              </p>
              <Link href="/guidelines" className="btn btn--ghost" style={{ marginTop: 'var(--s-3)' }}>
                {r.guidelinesCta}
              </Link>
            </PaperCard>
            </>
            )}
          </div>

          <div className="event-detail__form">
            {isPast ? (
              <PaperCard className="reg-closed" shadow="slab">
                <h3 className="reg-form__head">
                  {event.status === 'cancelled' ? side.cancelledHead : side.pastHead}
                </h3>
                {event.recap && <p>{event.recap}</p>}
                {event.status === 'completed' && event.rules.perk && <p>{event.rules.perk}.</p>}
                {event.host && (
                  <p>
                    <a href={event.host.href} target="_blank" rel="noreferrer">
                      {event.host.name}
                      {side.hostLink}
                    </a>
                  </p>
                )}
                <p style={{ marginTop: 'var(--s-4)' }}>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(side.nextSubject)}`}
                    className="btn btn--red btn--lg btn--block"
                  >
                    {side.next}
                  </a>
                </p>
              </PaperCard>
            ) : !collectsData() ? (
              /* static mode collects nothing — a real address beats a dead form */
              <PaperCard className="reg-closed" shadow="slab">
                <h3 className="reg-form__head">{side.comeHead}</h3>
                <p className="reg-form__notice">
                  <Rich text={audience.detail} />
                </p>
                <p>
                  <Rich text={side.comeBody} />
                </p>
                <p style={{ marginTop: 'var(--s-4)' }}>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${side.comeSubject} ${event.title}`)}`}
                    className="btn btn--red btn--lg btn--block"
                  >
                    {side.comeEmail} {CONTACT_EMAIL}
                  </a>
                </p>
                <p className="reg-form__foot">
                  <Rich text={side.comeFoot} />
                </p>
              </PaperCard>
            ) : (
              <RegistrationForm
                eventSlug={event.slug}
                audience={event.audience}
                needsFood={event.needsFoodInfo}
                guardianConsentUnder={event.rules.guardianConsentUnder}
                open={registrationOpen}
              />
            )}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="ink" className="event-close">
        <div className="wrap event-close__inner">
          <EditorialHeadline size={2}>
            {isPast ? c.eventClose.pastHead : c.eventClose.head}
          </EditorialHeadline>
          <p className="lead">
            <Rich text={c.eventClose.lead} />
          </p>
          <div className="event-close__ctas">
            <Link href="/events" className="btn btn--yellow">
              {c.eventClose.cta}
            </Link>
            <Sticker to="/join" color="paper" large>
              {c.eventClose.sticker}
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
