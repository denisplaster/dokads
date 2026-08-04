import { Link } from 'react-router-dom'
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
import { GUIDELINES_CHECKBOX, guidelines } from '../data/community'

export function Guidelines() {
  return (
    <>
      <ZineSection tone="acid" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            Community{' '}
            <br />
            guidelines.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            Short, and mostly about not making anyone justify their own family. Everyone who
            registers for an event agrees to these.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="red" tiltDir={1}>
              rules so nobody has to be brave to show up
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
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </ZineSection>
      ))}

      <ZineSection tone="ink" torn="both" className="guidelines-quote">
        <div className="wrap">
          <PullQuote cite="The short version">
            Nobody here has to prove they belong.
          </PullQuote>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="guidelines-harm">
        <div className="wrap wrap--wide guidelines-harm__inner">
          <div>
            <SectionHead number="05" kicker="If something goes wrong" />
            <div className="prose">
              <p>
                Harm gets addressed directly and privately first. That means talking to the
                people involved, being specific about what happened, and agreeing what changes —
                not a public pile-on, and not pretending it did not happen.
              </p>
              <p>
                Organisers can ask someone to step back from a gathering. Repeated or serious
                harm means being asked not to come back.
              </p>
              <p>
                If you are the person who was harmed, you decide how much you want to be
                involved in sorting it out. Reporting something does not commit you to a
                process.
              </p>
            </div>
          </div>
          <PaperCard className="guidelines-harm__card" tilt="nudge" tiltDir={-1} shadow="slab">
            <TapeStrip position="top-center" variant="clear" width={130} />
            <h3 className="eyebrow">At registration</h3>
            <div className="check check--demo">
              <input id="gl-demo" type="checkbox" disabled />
              <label htmlFor="gl-demo">{GUIDELINES_CHECKBOX}</label>
            </div>
            <p style={{ marginTop: 'var(--s-4)' }}>
              This box appears on every event registration form and on the join form. It is the
              only mandatory tick on either.
            </p>
            <div className="guidelines-harm__ctas">
              <Link to="/events" className="btn btn--red">
                See events
              </Link>
              <Sticker to="/about" color="yellow">
                About DOKADS
              </Sticker>
            </div>
          </PaperCard>
        </div>
      </ZineSection>
    </>
  )
}
