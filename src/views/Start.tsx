import type { Route } from 'next'
import Link from 'next/link'
import {
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  PullQuote,
  ScribbleUnderline,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { DokadDefinition } from '../components/DokadDefinition'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'

/** Colour and destination per card slot; the words are editable. */
const SLOTS: { tone: string; to: Route }[] = [
  { tone: 'yellow', to: '/am-i-a-dokad' },
  { tone: 'blue', to: '/learn' },
  { tone: 'pink', to: '/events' },
  { tone: 'green', to: '/stories' },
  { tone: 'peach', to: '/learn#family' as Route },
  { tone: 'lavender', to: '/about' },
]

export function Start() {
  const c = copy('start')
  const shared = copy('shared')
  const ROUTES = SLOTS.map((slot, i) => ({
    ...slot,
    ...c.routes.cards[i],
    num: String(i + 1).padStart(2, '0'),
  }))
  return (
    <>
      <ZineSection tone="blue" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="paper" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="start-def">
        <div className="wrap wrap--wide start-def__inner">
          <div>
            <SectionHead number="00" kicker={c.word.kicker} />
            <p className="prose">
              <Rich text={c.word.body} />
            </p>
            <ul className="reassure">
              {shared.reassurances.items.slice(0, 5).map((r, i) => (
                <li key={r} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                  <Rich text={r} />
                </li>
              ))}
            </ul>
          </div>
          <DokadDefinition text={shared.definition} />
        </div>
      </ZineSection>

      <ZineSection tone="bright" torn="both" className="start-routes">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={c.routes.kicker} />
          <div className="start-routes__grid">
            {ROUTES.map((r, i) => (
              <PaperCard
                key={r.num}
                className="route-card"
                data-tone={r.tone}
                tilt={i % 3 === 0 ? 'nudge' : 'hair'}
                tiltDir={i % 2 === 0 ? 1 : -1}
                pickup
                style={{ background: 'var(--surface)' }}
              >
                {i % 2 === 0 && <TapeStrip position="top-right" variant="clear" width={80} />}
                <span className="route-card__num">{r.num}</span>
                <h3 className="route-card__title">{r.title}</h3>
                <p className="route-card__body">
                  <Rich text={r.body} />
                </p>
                <div className="route-card__foot">
                  <Link href={r.to} className="btn btn--ghost">
                    {r.cta}
                  </Link>
                  {r.note && (
                    <HandwrittenNote color="red" tiltDir={-1}>
                      {r.note}
                    </HandwrittenNote>
                  )}
                </div>
              </PaperCard>
            ))}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="acid" className="start-quote">
        <div className="wrap">
          <PullQuote cite={c.quote.cite}>
            <Rich text={c.quote.quote} />
          </PullQuote>
          <ScribbleUnderline color="ink" variant={1} />
        </div>
      </ZineSection>

      <ZineSection tone="ink" torn="top" className="start-close">
        <div className="wrap start-close__inner">
          <div>
            <EditorialHeadline size={1}>
              <Rich text={c.close.headline} />
            </EditorialHeadline>
            <p className="lead" style={{ marginTop: 'var(--s-4)' }}>
              <Rich text={c.close.lead} />
            </p>
          </div>
          <div className="start-close__ctas">
            <Link href="/join" className="btn btn--yellow btn--lg">
              {c.close.cta}
            </Link>
            <Sticker to="/guidelines" color="paper">
              {c.close.sticker}
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
