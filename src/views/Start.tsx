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
import { REASSURANCES } from '../data/community'

const ROUTES: {
  num: string
  tone: string
  title: string
  body: string
  to: Route
  cta: string
  note?: string
}[] = [
  {
    num: '01',
    tone: 'yellow',
    title: 'I have never heard the word DoKAD',
    body: 'Start with the definition and the family diagram. Five minutes, no commitment, nothing to fill in.',
    to: '/am-i-a-dokad',
    cta: 'Am I a DoKAD?',
    note: 'most people start here',
  },
  {
    num: '02',
    tone: 'blue',
    title: 'I want to understand the history',
    body: 'The background on Korean adoption that most of us were never given — plus the specific reasons descendants experience it differently.',
    to: '/learn',
    cta: 'Learn the background',
  },
  {
    num: '03',
    tone: 'pink',
    title: 'I want to meet people like me',
    body: 'Coffee meetups, online gatherings, and guided conversations. Small, free, and mostly informal.',
    to: '/events',
    cta: 'See what’s coming up',
    note: 'the point, really',
  },
  {
    num: '04',
    tone: 'green',
    title: 'I want to read other people’s stories',
    body: 'Essays, interviews, poems, and photo stories from descendants. Anonymous and pseudonymous contributions welcome.',
    to: '/stories',
    cta: 'Read stories',
  },
  {
    num: '05',
    tone: 'peach',
    title: 'My parent was adopted and I want to talk to them about it',
    body: 'One of the most common reasons people arrive here. There is a topic queue on exactly this, and a guided discussion in the works.',
    to: '/learn#family',
    cta: 'Family + conversations',
  },
  {
    num: '06',
    tone: 'lavender',
    title: 'I am a parent, an adoptee, or an ally',
    body: 'You are welcome. Read how we think about who leads DoKAD programming, and what support looks like.',
    to: '/about',
    cta: 'About DOKADS',
  },
]

export function Start() {
  return (
    <>
      <ZineSection tone="blue" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            Start{' '}
            <br />
            here.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            There is no correct order and nothing you have to read first. Pick whichever of
            these sounds most like you today.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="paper" tiltDir={1}>
              you can also just poke around. that’s allowed.
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="start-def">
        <div className="wrap wrap--wide start-def__inner">
          <div>
            <SectionHead number="00" kicker="One word, up front" />
            <p className="prose">
              You will see the term <strong>DoKAD</strong> across this site. It is shorthand,
              not a club. Nobody is going to ask you to prove anything, and nobody is going to
              mind if you never use the word about yourself.
            </p>
            <ul className="reassure">
              {REASSURANCES.slice(0, 5).map((r, i) => (
                <li key={r} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <DokadDefinition />
        </div>
      </ZineSection>

      <ZineSection tone="bright" torn="both" className="start-routes">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Six ways in" />
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
                <p className="route-card__body">{r.body}</p>
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
          <PullQuote cite="Read this if you read nothing else">
            Your parent’s story and your story can be connected without being identical.
          </PullQuote>
          <ScribbleUnderline color="ink" variant={1} />
        </div>
      </ZineSection>

      <ZineSection tone="ink" torn="top" className="start-close">
        <div className="wrap start-close__inner">
          <div>
            <EditorialHeadline size={1}>Ready when you are.</EditorialHeadline>
            <p className="lead" style={{ marginTop: 'var(--s-4)' }}>
              Joining takes about a minute and tells us what to actually build. Most of it is
              optional.
            </p>
          </div>
          <div className="start-close__ctas">
            <Link href="/join" className="btn btn--yellow btn--lg">
              Join DOKADS
            </Link>
            <Sticker to="/guidelines" color="paper">
              Community guidelines
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
