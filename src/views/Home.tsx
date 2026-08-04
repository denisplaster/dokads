import Link from 'next/link'
import {
  EditorialHeadline,
  FlyerEventCard,
  HandArrow,
  HandwrittenNote,
  IssueLabel,
  Marquee,
  PaperCard,
  PullQuote,
  SectionHead,
  ScribbleUnderline,
  Sticker,
  TapeStrip,
  ZineArticleCard,
  ZineSection,
  rot,
} from '../components/zine'
import { DokadDefinition } from '../components/DokadDefinition'
import { pillars } from '../data/pillars'
import type { Story } from '../data/stories'
import type { DokEvent } from '../data/events'
import { COMMUNITY_LED_PRINCIPLE } from '../data/community'
import { CollageFrame } from '../components/zine/CollageFrame'
import { RotatingPhrase } from '../components/RotatingPhrase'

export function Home({ stories, events }: { stories: Story[]; events: DokEvent[] }) {
  const featured = stories.filter((s) => s.featured)
  const rest = stories.filter((s) => !s.featured).slice(0, 4)
  const nextEvents = events.slice(0, 3)

  return (
    <>
      {/* ================= HERO ================= */}
      <ZineSection tone="paper" torn="bottom" className="hero">
        <div className="hero__deco" aria-hidden="true">
          <span className="blob hero__blob-1" />
          <span className="blob hero__blob-2" />
          <span className="hero__rule" />
        </div>

        <div className="wrap wrap--wide hero__inner">
          <div className="hero__top">
            <IssueLabel />
            <RotatingPhrase />
          </div>

          <p className="hero__eyebrow">
            Your parent’s adoption story may be part of your story too.
          </p>

          <EditorialHeadline size="display" sentence className="hero__headline">
            <span className="hero__headline-premise">
              Your parent or grandparent was{' '}
              <span className="highlight">adopted from Korea</span>.
            </span>{' '}
            <span className="hero__headline-ask">So, what does that mean for you?</span>
          </EditorialHeadline>

          <div className="hero__body">
            <p className="lead">
              DOKADS is a community and learning hub for children, grandchildren, and other
              descendants of Korean adoptees. Come explore the questions, stories, cultures,
              relationships, and identities that can continue across generations.
            </p>

            <div className="hero__ctas">
              <Link href="/start" className="btn btn--red btn--lg">
                Start here
              </Link>
              <Link href="/am-i-a-dokad" className="btn btn--paper btn--lg">
                Am I a DoKAD?
              </Link>
              <Link href="/events" className="btn btn--ghost">
                Meet other DoKADs
              </Link>
            </div>

            <p className="hero__note">
              <HandArrow turn={22} size={64} color="blue" className="hero__note-arrow" />
              <HandwrittenNote>
                Never heard the word DoKAD before? You’re not alone.
              </HandwrittenNote>
            </p>
          </div>

          <div className="hero__def">
            <DokadDefinition />
          </div>
        </div>
      </ZineSection>

      <Marquee
        tone="ink"
        items={[
          'Descendants of Korean adoptees',
          'Issue 001',
          'Start with curiosity',
          'You belong in the conversation',
          'Minnesota + everywhere else',
        ]}
      />

      {/* ================= AM I A DOKAD teaser ================= */}
      <ZineSection tone="acid" torn="bottom" className="teaser">
        <div className="wrap wrap--wide">
          <SectionHead number="00" kicker="The first question" />
          <div className="teaser__grid">
            <div>
              <EditorialHeadline size={1}>
                Was your parent or grandparent{' '}
                <br />
                adopted from Korea?
              </EditorialHeadline>
              <ScribbleUnderline color="red" variant={2} />
              <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
                That is the only question that matters to start. If the answer is yes — or
                probably, or you think so but nobody has ever really explained it — you are in
                the right place.
              </p>
              <div className="teaser__ctas">
                <Link href="/am-i-a-dokad" className="btn btn--blue btn--lg">
                  Walk me through it
                </Link>
                <HandwrittenNote color="red" tiltDir={1}>
                  takes 30 seconds
                </HandwrittenNote>
              </div>
            </div>
            <div className="teaser__art">
              <PaperCard tilt="tilt" shadow="slab">
                <TapeStrip position="top-left" variant="blue" />
                <ul className="teaser__list">
                  <li>My mother was adopted from Korea</li>
                  <li>My father was adopted from Korea</li>
                  <li>One or both of my parents are Korean adoptees</li>
                  <li>My grandparent was adopted from Korea</li>
                  <li>More than one person in my family was adopted from Korea</li>
                  <li className="teaser__list-soft">
                    I am still figuring out how this history relates to me
                  </li>
                </ul>
                <p className="teaser__foot">
                  Any of these? <strong>Then yes.</strong>
                </p>
              </PaperCard>
            </div>
          </div>
        </div>
      </ZineSection>

      {/* ================= WHO / WHAT / WHERE / WHY ================= */}
      <ZineSection tone="paper" className="pillars">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Who, what, where and why" />
          <p className="lead pillars__intro">
            Four ways into the same subject. Take them in any order — or take one and leave.
          </p>

          <div className="pillars__grid">
            {pillars.map((p, i) => (
              <article
                key={p.id}
                className={`pillar pillar--${p.id}`}
                data-tone={p.tone}
                style={rot(i % 2 === 0 ? 'hair' : 'nudge', i % 3 === 0 ? -1 : 1)}
              >
                <div className="pillar__art" aria-hidden="true">
                  <CollageFrame seed={`pillar-${p.id}`} variant={p.art} ratio="16 / 7" />
                </div>
                <div className="pillar__body">
                  <span className="pillar__num">{p.number}</span>
                  <h3 className="pillar__word">{p.word}</h3>
                  <p className="pillar__q">{p.question}</p>
                  <p className="pillar__dek">{p.dek}</p>
                  <ul className="pillar__points">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="pillar__foot">
                    <Link href={`/learn#${p.id}`} className="pillar__link">
                      Read the long version
                      <HandArrow size={44} color="ink" className="pillar__arrow" />
                    </Link>
                    <HandwrittenNote color="ink" className="pillar__note" tiltDir={1}>
                      {p.note}
                    </HandwrittenNote>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </ZineSection>

      {/* ================= STORIES ================= */}
      <ZineSection tone="ink" torn="both" className="home-stories">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker="Stories from the next generation" />

          <div className="home-stories__lead">
            {featured[0] && <ZineArticleCard story={featured[0]} layout="lead" />}
            <div className="home-stories__side">
              {featured.slice(1).map((s, i) => (
                <ZineArticleCard key={s.slug} story={s} layout="text" index={i} />
              ))}
            </div>
          </div>

          <div className="home-stories__grid">
            {rest.map((s, i) => (
              <ZineArticleCard
                key={s.slug}
                story={s}
                index={i}
                layout={i === 1 ? 'quote' : i === 3 ? 'note' : 'standard'}
              />
            ))}
          </div>

          <div className="home-stories__foot">
            <Link href="/stories" className="btn btn--yellow btn--lg">
              Read all stories
            </Link>
            <HandwrittenNote color="paper" tiltDir={1}>
              got one of your own? →
            </HandwrittenNote>
            <Sticker to="/stories#submit" color="paper">
              Tell us your story
            </Sticker>
          </div>
        </div>
      </ZineSection>

      {/* ================= PULL QUOTE BREAK ================= */}
      <ZineSection tone="bright" tight className="quote-break">
        <div className="wrap">
          <PullQuote cite="A community principle, not a slogan">
            You do not need to have everything figured out before taking part.
          </PullQuote>
        </div>
      </ZineSection>

      {/* ================= EVENTS ================= */}
      <ZineSection tone="blue" torn="top" className="home-events">
        <div className="wrap wrap--wide">
          <SectionHead number="03" kicker="Coming up" />
          <div className="home-events__head">
            <EditorialHeadline size={2}>
              Come and meet{' '}
              <br />
              some people
            </EditorialHeadline>
            <p className="lead">
              Small gatherings, mostly free, mostly informal. Coffee shops and video calls
              rather than conference rooms.
            </p>
          </div>

          <div className="home-events__wall">
            {nextEvents.map((e, i) => (
              <Link key={e.id} href={`/events/${e.slug}`} className="home-events__link">
                <FlyerEventCard event={e} index={i} />
              </Link>
            ))}
          </div>

          <div className="home-events__foot">
            <Link href="/events" className="btn btn--yellow">
              All events
            </Link>
            <Link href="/regions/minnesota" className="btn btn--paper">
              Minnesota DoKADs
            </Link>
          </div>
        </div>
      </ZineSection>

      {/* ================= COMMUNITY-LED ================= */}
      <ZineSection tone="paper" className="principle">
        <div className="wrap wrap--wide principle__inner">
          <PaperCard tilt="hair" shadow="slab" className="principle__card">
            <TapeStrip position="top-center" variant="kraft" width={140} />
            <span className="eyebrow">Our one non-negotiable</span>
            {/* sentence case is required here, not stylistic — uppercase would
                flatten the deliberate “DoKAD” / “DoKADs” casing */}
            <EditorialHeadline size={2} sentence className="principle__head">
              {COMMUNITY_LED_PRINCIPLE.headline}
            </EditorialHeadline>
            <p className="measure">{COMMUNITY_LED_PRINCIPLE.body}</p>
            <div className="principle__ctas">
              <Link href="/about" className="btn btn--ghost">
                About DOKADS
              </Link>
              <Link href="/guidelines" className="btn btn--ghost">
                Community guidelines
              </Link>
            </div>
          </PaperCard>

          <div className="principle__aside">
            <HandwrittenNote color="red" tiltDir={-1}>
              adoptees made this generation possible. we know.
            </HandwrittenNote>
            <CollageFrame seed="principle-art" variant="arc" ratio="1 / 1" />
          </div>
        </div>
      </ZineSection>

      {/* ================= JOIN ================= */}
      <ZineSection tone="red" torn="top" className="home-join">
        <div className="wrap wrap--wide home-join__inner">
          <div>
            <span className="eyebrow">Last thing</span>
            <EditorialHeadline size="display">
              You belong in{' '}
              <br />
              the conversation.
            </EditorialHeadline>
            <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
              A few quick questions — nothing too personal. It helps us work out what to run,
              where, and when.
            </p>
            <div className="home-join__ctas">
              <Link href="/join" className="btn btn--yellow btn--lg">
                Join DOKADS
              </Link>
              <Link href="/share" className="btn btn--ghost">
                Share it with someone
              </Link>
            </div>
          </div>
          <div className="home-join__deco" aria-hidden="true">
            <Sticker color="paper" large>
              Free
            </Sticker>
            <Sticker color="yellow" large tiltDir={1}>
              All ages
            </Sticker>
            <Sticker color="ink" large>
              No experience required
            </Sticker>
            <Sticker color="paper" large tiltDir={1}>
              Leave whenever
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
