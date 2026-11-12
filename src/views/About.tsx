import Link from 'next/link'
import {
  CollageFrame,
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  PullQuote,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'

const POSITIONING_TONES = ['yellow', 'blue', 'pink']

export function About() {
  const c = copy('about')
  const principle = copy('shared').principle
  const POSITIONING = c.positioning.cards.map((card, i) => ({
    ...card,
    n: String(i + 1).padStart(2, '0'),
    tone: POSITIONING_TONES[i % POSITIONING_TONES.length],
  }))
  return (
    <>
      <ZineSection tone="lavender" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
        </div>
      </ZineSection>

      {/* three things */}
      <ZineSection tone="paper" className="about-positioning">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={c.positioning.kicker} />
          <div className="grid grid--3">
            {POSITIONING.map((p, i) => (
              <PaperCard
                key={p.n}
                data-tone={p.tone}
                style={{ background: 'var(--surface)' }}
                tilt={i % 2 === 0 ? 'nudge' : 'hair'}
                tiltDir={i % 2 === 0 ? 1 : -1}
                pickup
              >
                <span className="route-card__num">{p.n}</span>
                <h3 className="route-card__title">{p.title}</h3>
                <p>
                  <Rich text={p.body} />
                </p>
              </PaperCard>
            ))}
          </div>
        </div>
      </ZineSection>

      {/* the principle */}
      <ZineSection tone="ink" torn="both" className="about-principle">
        <div className="wrap wrap--wide about-principle__inner">
          <div>
            <SectionHead number="02" kicker={c.principle.kicker} />
            <PullQuote>
              <Rich text={principle.headline} />
            </PullQuote>
            <div className="prose" style={{ marginTop: 'var(--s-6)' }}>
              <p>
                <Rich text={principle.about} />
              </p>
              <p>
                <Rich text={principle.body} />
              </p>
            </div>
            <p style={{ marginTop: 'var(--s-5)' }}>
              <HandwrittenNote color="paper" tiltDir={-1}>
                {c.principle.note}
              </HandwrittenNote>
            </p>
          </div>
          <div className="about-principle__art">
            <CollageFrame seed="about-principle" variant="stack" ratio="4 / 5" />
            <p className="caption">
              <Rich text={c.principle.caption} />
            </p>
          </div>
        </div>
      </ZineSection>

      {/* what we don't assume */}
      <ZineSection tone="acid" className="about-assume">
        <div className="wrap wrap--wide">
          <SectionHead number="03" kicker={c.assume.kicker} />
          <p className="lead">
            <Rich text={c.assume.lead} />
          </p>
          <ul className="about-assume__list">
            {c.assume.list.map((a, i) => (
              <li key={a} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                <Rich text={a} />
              </li>
            ))}
          </ul>
          <p className="about-assume__foot">
            <Rich text={c.assume.foot} />
          </p>
        </div>
      </ZineSection>

      {/* adoptee community */}
      <ZineSection tone="paper" torn="top" className="about-partners">
        <div className="wrap wrap--wide about-partners__inner">
          <div>
            <SectionHead number="04" kicker={c.partners.kicker} />
            <div className="prose">
              {c.partners.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </div>
          <PaperCard className="about-partners__card" tilt="nudge" tiltDir={-1} shadow="slab">
            <TapeStrip position="top-right" variant="kraft" width={100} />
            <h3 className="eyebrow">{c.partners.cardTitle}</h3>
            <p>
              <Rich text={c.partners.cardBody} />
            </p>
            <div className="about-partners__ctas">
              <Link href="/regions/minnesota" className="btn btn--ghost">
                {c.partners.cardRegion}
              </Link>
              <Link href="/guidelines" className="btn btn--ghost">
                {c.partners.cardGuidelines}
              </Link>
            </div>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="red" className="about-close">
        <div className="wrap about-close__inner">
          <EditorialHeadline size={1}>
            <Rich text={c.close.headline} />
          </EditorialHeadline>
          <p className="lead">
            <Rich text={c.close.lead} />
          </p>
          <div className="about-close__ctas">
            <Link href="/join" className="btn btn--yellow btn--lg">
              {c.close.cta}
            </Link>
            <Sticker to="/share" color="paper" large>
              {c.close.sticker}
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
