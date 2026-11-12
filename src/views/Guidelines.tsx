import Link from 'next/link'
import {
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

const TONES = ['yellow', 'blue', 'pink', 'green']

export function Guidelines() {
  const c = copy('guidelines')
  const guidelines = c.groups.groups.map((g, i) => ({
    ...g,
    number: String(i + 1).padStart(2, '0'),
    tone: TONES[i % TONES.length],
  }))
  return (
    <>
      <ZineSection tone="acid" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="red" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {guidelines.map((g, i) => (
        <ZineSection
          key={g.number}
          tone={i % 2 === 0 ? 'paper' : 'bright'}
          className="guideline-sec"
        >
          <div className="wrap wrap--wide guideline__inner">
            <div className="guideline__head" data-tone={g.tone}>
              <span className="guideline__num">{g.number}</span>
              <h2 className="guideline__title">{g.title}</h2>
            </div>
            <ul className="guideline__list">
              {g.items.map((item, j) => (
                <li key={item} style={rot('hair', j % 2 === 0 ? 1 : -1)}>
                  <span className="guideline__bullet" aria-hidden="true" />
                  <Rich text={item} />
                </li>
              ))}
            </ul>
          </div>
        </ZineSection>
      ))}

      <ZineSection tone="ink" torn="both" className="guidelines-quote">
        <div className="wrap">
          <PullQuote cite={c.quote.cite}>
            <Rich text={c.quote.quote} />
          </PullQuote>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="guidelines-harm">
        <div className="wrap wrap--wide guidelines-harm__inner">
          <div>
            <SectionHead
              number={String(guidelines.length + 1).padStart(2, '0')}
              kicker={c.harm.kicker}
            />
            <div className="prose">
              {c.harm.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </div>
          <PaperCard className="guidelines-harm__card" tilt="nudge" tiltDir={-1} shadow="slab">
            <TapeStrip position="top-center" variant="clear" width={130} />
            <h3 className="eyebrow">{c.harm.cardTitle}</h3>
            <div className="check check--demo">
              <input id="gl-demo" type="checkbox" disabled />
              <label htmlFor="gl-demo">{c.harm.checkbox}</label>
            </div>
            <p style={{ marginTop: 'var(--s-4)' }}>
              <Rich text={c.harm.cardBody} />
            </p>
            <div className="guidelines-harm__ctas">
              <Link href="/events" className="btn btn--red">
                {c.harm.ctaEvents}
              </Link>
              <Sticker to="/about" color="yellow">
                {c.harm.ctaAbout}
              </Sticker>
            </div>
          </PaperCard>
        </div>
      </ZineSection>
    </>
  )
}
