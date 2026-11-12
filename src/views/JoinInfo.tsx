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
import { copy } from '../content/copy'
import { CONTACT_EMAIL } from '../lib/site-mode'
import { Rich } from '../components/Rich'
import type { Route } from 'next'

const CARD_TARGETS: { to: Route; tilt: 'hair' | 'nudge'; dir?: 1 | -1 }[] = [
  { to: '/stories', tilt: 'hair' },
  { to: '/resources', tilt: 'nudge', dir: -1 },
  { to: '/events', tilt: 'hair', dir: -1 },
]

/**
 * The static stand-in for the join questionnaire.
 *
 * While the site runs in static mode it collects nothing, so this page does
 * the honest version of the same job: say plainly that sign-ups are not open,
 * describe what joining will mean, and give people a real address instead of
 * a form that goes nowhere. The questionnaire itself still lives in Join.tsx.
 */
export function JoinInfo() {
  const c = copy('join')
  const shared = copy('shared')
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.hero.emailSubject)}`

  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide join-head__inner">
          <div>
            <IssueLabel />
            <EditorialHeadline size="display" sentence className="join-head__title">
              <Rich text={c.hero.headline} />
            </EditorialHeadline>
            <ScribbleUnderline color="red" variant={2} />
            <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
              <Rich text={c.hero.lead} />
            </p>
            <p className="join-head__note">
              <HandArrow turn={14} size={60} color="blue" />
              <HandwrittenNote>{c.hero.note}</HandwrittenNote>
            </p>
            <div className="hero__ctas" style={{ marginTop: 'var(--s-5)' }}>
              <a href={mailto} className="btn btn--red btn--lg">
                {c.hero.emailLabel} {CONTACT_EMAIL}
              </a>
              <Link href="/am-i-a-dokad" className="btn btn--paper btn--lg">
                {c.hero.amI}
              </Link>
            </div>
          </div>
          <DokadDefinition text={shared.definition} showCta={false} />
        </div>
      </ZineSection>

      <ZineSection tone="bright" className="join-info">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={c.now.kicker} />
          <div className="grid grid--3">
            {CARD_TARGETS.map((slot, i) => {
              const card = c.now.cards[i]
              return (
                <PaperCard key={slot.to} tilt={slot.tilt} tiltDir={slot.dir} pickup>
                  <span className="route-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="route-card__title">{card?.title}</h3>
                  <p className="route-card__body">
                    <Rich text={card?.body ?? ''} />
                  </p>
                  <div className="route-card__foot">
                    <Link href={slot.to} className="btn btn--ghost">
                      {card?.cta}
                    </Link>
                  </div>
                </PaperCard>
              )
            })}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="acid" torn="both" className="join-info-promise">
        <div className="wrap wrap--wide join-info-promise__inner">
          <div>
            <SectionHead number="02" kicker={c.promise.kicker} />
            <div className="prose">
              {c.promise.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
            <ul className="reassure">
              {shared.reassurances.items.slice(0, 4).map((r, i) => (
                <li key={r} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                  <Rich text={r} />
                </li>
              ))}
            </ul>
          </div>

          <PaperCard tilt="nudge" tiltDir={-1} shadow="slab" className="join-info-promise__card">
            <TapeStrip position="top-center" variant="clear" width={130} />
            <span className="eyebrow">{c.promise.cardTitle}</span>
            <ul className="submit-card__list" style={{ marginTop: 'var(--s-3)' }}>
              {c.promise.cardList.map((item) => (
                <li key={item.lead}>
                  <strong>{item.lead}</strong> <Rich text={item.rest} />
                </li>
              ))}
            </ul>
            <div className="submit-card__foot">
              <Sticker to="/privacy" color="paper">
                {c.promise.cardCta}
              </Sticker>
            </div>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="ink" className="join-info-close">
        <div className="wrap start-close__inner">
          <div>
            <EditorialHeadline size={1} sentence>
              <Rich text={c.close.headline} />
            </EditorialHeadline>
            <p className="lead" style={{ marginTop: 'var(--s-4)' }}>
              <Rich text={c.close.lead} />
            </p>
          </div>
          <div className="start-close__ctas">
            <a href={mailto} className="btn btn--yellow btn--lg">
              {c.hero.emailLabel} {CONTACT_EMAIL}
            </a>
            <Sticker to="/guidelines" color="paper">
              {c.close.sticker}
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
