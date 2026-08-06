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
import { COMMUNITY_LED_PRINCIPLE } from '../data/community'

const POSITIONING = [
  {
    n: '01',
    tone: 'yellow',
    title: 'An introduction',
    body: 'Help people understand the term and recognise whether the community may include them. Most visitors arrive having never seen the word.',
  },
  {
    n: '02',
    tone: 'blue',
    title: 'A resource',
    body: 'Clear, respectful information about identity, family, Korea, adoption, culture, and what travels between generations.',
  },
  {
    n: '03',
    tone: 'pink',
    title: 'A connection point',
    body: 'Events, local groups, stories, and ways to take part — so the questions get asked in company rather than alone.',
  },
]

const NOT_ASSUMED = [
  'that everyone feels affected by adoption',
  'that every DoKAD wants a connection to Korea',
  'that everyone has access to adoption records',
  'that everyone has a good relationship with their adoptee parent',
  'that everyone identifies as Korean',
  'that every DoKAD is mixed race',
  'that anyone wants to discuss trauma',
  'that DoKAD is a diagnosis, a requirement, or a fixed category',
]

export function About() {
  return (
    <>
      <ZineSection tone="lavender" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            About{' '}
            <br />
            DOKADS.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            A community and learning hub for children, grandchildren, and other descendants of
            Korean adoptees — built by descendants, for descendants.
          </p>
        </div>
      </ZineSection>

      {/* three things */}
      <ZineSection tone="paper" className="about-positioning">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Three connected things" />
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
                <p>{p.body}</p>
              </PaperCard>
            ))}
          </div>
        </div>
      </ZineSection>

      {/* the principle */}
      <ZineSection tone="ink" torn="both" className="about-principle">
        <div className="wrap wrap--wide about-principle__inner">
          <div>
            <SectionHead number="02" kicker="Community-led, and we mean it" />
            <PullQuote>{COMMUNITY_LED_PRINCIPLE.headline}</PullQuote>
            <div className="prose" style={{ marginTop: 'var(--s-6)' }}>
              <p>{COMMUNITY_LED_PRINCIPLE.about}</p>
              <p>{COMMUNITY_LED_PRINCIPLE.body}</p>
            </div>
            <p style={{ marginTop: 'var(--s-5)' }}>
              <HandwrittenNote color="paper" tiltDir={-1}>
                with, not on behalf of.
              </HandwrittenNote>
            </p>
          </div>
          <div className="about-principle__art">
            <CollageFrame seed="about-principle" variant="stack" ratio="4 / 5" />
            <p className="caption">
              <strong>Where it applies</strong> — this principle governs the About page,
              community values, volunteer and committee roles, event planning, and any future
              regional-group guidelines.
            </p>
          </div>
        </div>
      </ZineSection>

      {/* what we don't assume */}
      <ZineSection tone="acid" className="about-assume">
        <div className="wrap wrap--wide">
          <SectionHead number="03" kicker="What we do not assume" />
          <p className="lead">
            The fastest way to make someone feel like they do not belong is to describe an
            experience they do not recognise. So we try not to assume:
          </p>
          <ul className="about-assume__list">
            {NOT_ASSUMED.map((a, i) => (
              <li key={a} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                {a}
              </li>
            ))}
          </ul>
          <p className="about-assume__foot">
            <strong>There is no single DoKAD experience.</strong> If something on this site
            reads as though there is, tell us and we will fix the wording.
          </p>
        </div>
      </ZineSection>

      {/* adoptee community */}
      <ZineSection tone="paper" torn="top" className="about-partners">
        <div className="wrap wrap--wide about-partners__inner">
          <div>
            <SectionHead number="04" kicker="Adoptees, parents, and partners" />
            <div className="prose">
              <p>
                Korean adoptees built the organisations, the writing, the research, and the
                language that this community stands on. Nothing here replaces adoptee-led work,
                and adoptee voices remain central to any conversation about Korean adoption.
              </p>
              <p>
                Descendants also have questions of their own — about a parent’s history, about
                race, about a family tree that stops — and those questions deserve a place that
                is built around them.
              </p>
              <p>
                DOKADS is powered by{' '}
                <a href="https://www.akconnection.com" target="_blank" rel="noreferrer">
                  AK Connection
                </a>
                , the Minnesota-based community organisation for adult Korean adoptees — support
                that looks exactly like the principle above: adoptees backing the next
                generation’s space without directing it. Other organisations, researchers, and
                allies are welcome to support, fund, mentor, and partner, and{' '}
                <strong>
                  being part of DOKADS does not connect you to any other organisation
                </strong>
                .
              </p>
            </div>
          </div>
          <PaperCard className="about-partners__card" tilt="nudge" tiltDir={-1} shadow="slab">
            <TapeStrip position="top-right" variant="kraft" width={100} />
            <h3 className="eyebrow">Where this started</h3>
            <p>
              DOKADS began with a survey of descendants of Korean adoptees. The findings shape
              the site you are reading: plain language before jargon, social gatherings before
              programming, coffee shops before bars, and a first local community in Minnesota
              with everything else built for a wider audience.
            </p>
            <div className="about-partners__ctas">
              <Link href="/regions/minnesota" className="btn btn--ghost">
                Minnesota DoKADs
              </Link>
              <Link href="/guidelines" className="btn btn--ghost">
                Community guidelines
              </Link>
            </div>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="red" className="about-close">
        <div className="wrap about-close__inner">
          <EditorialHeadline size={1}>Want a say in what this becomes?</EditorialHeadline>
          <p className="lead">That is not a rhetorical question — it is the whole model.</p>
          <div className="about-close__ctas">
            <Link href="/join" className="btn btn--yellow btn--lg">
              Join DOKADS
            </Link>
            <Sticker to="/share" color="paper" large>
              Share it with someone
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
