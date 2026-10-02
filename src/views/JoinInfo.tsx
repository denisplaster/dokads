import Link from 'next/link'
import {
  EditorialHeadline,
  HandArrow,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  ScribbleUnderline,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { DokadDefinition } from '../components/DokadDefinition'
import { CONTACT_EMAIL } from '../lib/site-mode'
import { REASSURANCES } from '../data/community'

/**
 * The static stand-in for the join questionnaire.
 *
 * While the site runs in static mode it collects nothing, so this page does
 * the honest version of the same job: say plainly that sign-ups are not open,
 * describe what joining will mean, and give people a real address instead of
 * a form that goes nowhere. The questionnaire itself still lives in Join.tsx.
 */
export function JoinInfo() {
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('I’d like to hear about DOKADS')}`

  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide join-head__inner">
          <div>
            <IssueLabel />
            <EditorialHeadline size="display" sentence className="join-head__title">
              Want in? Email us.
            </EditorialHeadline>
            <ScribbleUnderline color="red" variant={2} />
            <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
              Sign-ups are not open yet. Until they are, the whole site is here to read — and
              the fastest way to hear when something starts is simply to send us a note.
            </p>
            <p className="join-head__note">
              <HandArrow turn={14} size={60} color="blue" />
              <HandwrittenNote>no form, no account, no newsletter machine</HandwrittenNote>
            </p>
            <div className="hero__ctas" style={{ marginTop: 'var(--s-5)' }}>
              <a href={mailto} className="btn btn--red btn--lg">
                Email {CONTACT_EMAIL}
              </a>
              <Link href="/am-i-a-dokad" className="btn btn--paper btn--lg">
                Am I a DoKAD?
              </Link>
            </div>
          </div>
          <DokadDefinition showCta={false} />
        </div>
      </ZineSection>

      <ZineSection tone="bright" className="join-info">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="What there is to do right now" />
          <div className="grid grid--3">
            <PaperCard tilt="hair" pickup>
              <span className="route-card__num">01</span>
              <h3 className="route-card__title">Read the explainers</h3>
              <p className="route-card__body">
                A short history of Korean adoption, what the term means, why descendants
                experience it differently, and how to talk to an adoptee parent about it.
              </p>
              <div className="route-card__foot">
                <Link href="/stories" className="btn btn--ghost">
                  Read stories
                </Link>
              </div>
            </PaperCard>
            <PaperCard tilt="nudge" tiltDir={-1} pickup>
              <span className="route-card__num">02</span>
              <h3 className="route-card__title">Take the reading pile</h3>
              <p className="route-card__body">
                Memoirs, documentaries, podcasts, and the adoptee-led organisations that have
                been doing this work far longer than we have.
              </p>
              <div className="route-card__foot">
                <Link href="/resources" className="btn btn--ghost">
                  Open resources
                </Link>
              </div>
            </PaperCard>
            <PaperCard tilt="hair" tiltDir={-1} pickup>
              <span className="route-card__num">03</span>
              <h3 className="route-card__title">See what is being planned</h3>
              <p className="route-card__body">
                Nothing is confirmed yet, and every event says so plainly. Email us if you want
                to hear the moment one is.
              </p>
              <div className="route-card__foot">
                <Link href="/events" className="btn btn--ghost">
                  See events
                </Link>
              </div>
            </PaperCard>
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="acid" torn="both" className="join-info-promise">
        <div className="wrap wrap--wide join-info-promise__inner">
          <div>
            <SectionHead number="02" kicker="When sign-ups do open" />
            <div className="prose">
              <p>
                It will be a few short questions — what connects you to Korean adoption, what
                you would like this community to run, and when you could actually come. Nothing
                harder than that, and most of it optional.
              </p>
              <p>
                <strong>The first question will never be “do you identify as a DoKAD?”</strong>{' '}
                It will be “was your parent or grandparent adopted from Korea?” — because plenty
                of people belong here long before they would use the word about themselves.
              </p>
            </div>
            <ul className="reassure">
              {REASSURANCES.slice(0, 4).map((r, i) => (
                <li key={r} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <PaperCard tilt="nudge" tiltDir={-1} shadow="slab" className="join-info-promise__card">
            <TapeStrip position="top-center" variant="clear" width={130} />
            <span className="eyebrow">What we are not doing</span>
            <ul className="submit-card__list" style={{ marginTop: 'var(--s-3)' }}>
              <li>
                <strong>No account.</strong> Nothing to sign up for or log into.
              </li>
              <li>
                <strong>No tracking.</strong> No analytics, no pixels, no cookies.
              </li>
              <li>
                <strong>No list.</strong> We are not storing anything about you at all.
              </li>
              <li>
                <strong>No newsletter.</strong> If you email us, a person reads it.
              </li>
            </ul>
            <div className="submit-card__foot">
              <Sticker to="/privacy" color="paper">
                Read the privacy page
              </Sticker>
            </div>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="ink" className="join-info-close">
        <div className="wrap start-close__inner">
          <div>
            <EditorialHeadline size={1} sentence>
              You do not need to have everything figured out to say hello.
            </EditorialHeadline>
            <p className="lead" style={{ marginTop: 'var(--s-4)' }}>
              Tell us as much or as little as you want. Share only what feels comfortable.
            </p>
          </div>
          <div className="start-close__ctas">
            <a href={mailto} className="btn btn--yellow btn--lg">
              Email {CONTACT_EMAIL}
            </a>
            <Sticker to="/guidelines" color="paper">
              Community guidelines
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
