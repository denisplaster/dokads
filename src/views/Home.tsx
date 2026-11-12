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
import { Rich } from '../components/Rich'
import type { Story } from '../data/stories'
import type { DokEvent } from '../data/events'
import { CollageFrame } from '../components/zine/CollageFrame'
import { RotatingPhrase } from '../components/RotatingPhrase'
import { contactMailto } from '../lib/site-mode'
import { copy } from '../content/copy'
import { pillarList } from '../content/derived'

const STICKER_COLORS = ['paper', 'yellow', 'ink', 'paper'] as const

export function Home({
  stories,
  upcoming,
  past,
}: {
  stories: Story[]
  upcoming: DokEvent[]
  past: DokEvent[]
}) {
  const c = copy('home')
  const shared = copy('shared')
  const pillars = pillarList()
  const featured = stories.filter((s) => s.featured)
  const rest = stories.filter((s) => !s.featured).slice(0, 4)
  const nextEvents = upcoming.slice(0, 3)
  // with nothing scheduled, show what already happened rather than an empty wall
  const lastTime = past.slice(0, 1)

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
            <RotatingPhrase phrases={c.hero.rotating} />
          </div>

          <p className="hero__eyebrow">
            <Rich text={c.hero.eyebrow} />
          </p>

          <EditorialHeadline size="display" sentence className="hero__headline">
            <span className="hero__headline-premise">
              <Rich text={c.hero.premise} />
            </span>{' '}
            <span className="hero__headline-ask">
              <Rich text={c.hero.ask} />
            </span>
          </EditorialHeadline>

          <div className="hero__body">
            <p className="lead">
              <Rich text={c.hero.lead} />
            </p>

            <div className="hero__ctas">
              <Link href="/start" className="btn btn--red btn--lg">
                {c.hero.ctaStart}
              </Link>
              <Link href="/am-i-a-dokad" className="btn btn--paper btn--lg">
                {c.hero.ctaAmI}
              </Link>
              <Link href="/events" className="btn btn--ghost">
                {c.hero.ctaEvents}
              </Link>
            </div>

            <p className="hero__note">
              <HandArrow turn={22} size={64} color="blue" className="hero__note-arrow" />
              <HandwrittenNote>{c.hero.note}</HandwrittenNote>
            </p>
          </div>

          <div className="hero__def">
            <DokadDefinition text={shared.definition} />
          </div>
        </div>
      </ZineSection>

      <Marquee tone="ink" items={c.hero.marquee} />

      {/* ================= AM I A DOKAD teaser ================= */}
      <ZineSection tone="acid" torn="bottom" className="teaser">
        <div className="wrap wrap--wide">
          <SectionHead number="00" kicker={c.teaser.kicker} />
          <div className="teaser__grid">
            <div>
              <EditorialHeadline size={1}>
                <Rich text={c.teaser.headline} />
              </EditorialHeadline>
              <ScribbleUnderline color="red" variant={2} />
              <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
                <Rich text={c.teaser.lead} />
              </p>
              <div className="teaser__ctas">
                <Link href="/am-i-a-dokad" className="btn btn--blue btn--lg">
                  {c.teaser.cta}
                </Link>
                <HandwrittenNote color="red" tiltDir={1}>
                  {c.teaser.note}
                </HandwrittenNote>
              </div>
            </div>
            <div className="teaser__art">
              <PaperCard tilt="tilt" shadow="slab">
                <TapeStrip position="top-left" variant="blue" />
                <ul className="teaser__list">
                  {c.teaser.examples.map((e) => (
                    <li key={e}>
                      <Rich text={e} />
                    </li>
                  ))}
                  {c.teaser.softExample && (
                    <li className="teaser__list-soft">
                      <Rich text={c.teaser.softExample} />
                    </li>
                  )}
                </ul>
                <p className="teaser__foot">
                  <Rich text={c.teaser.foot} />
                </p>
              </PaperCard>
            </div>
          </div>
        </div>
      </ZineSection>

      {/* ================= WHO / WHAT / WHERE / WHY ================= */}
      <ZineSection tone="paper" className="pillars">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={c.pillars.kicker} />
          <p className="lead pillars__intro">
            <Rich text={c.pillars.intro} />
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
                      <li key={pt}>
                        <Rich text={pt} />
                      </li>
                    ))}
                  </ul>
                  <div className="pillar__foot">
                    <Link href={`/learn#${p.id}`} className="pillar__link">
                      {c.pillars.link}
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
          <SectionHead number="02" kicker={c.stories.kicker} />

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
              {c.stories.cta}
            </Link>
            <HandwrittenNote color="paper" tiltDir={1}>
              {c.stories.note}
            </HandwrittenNote>
            <Sticker to="/stories#submit" color="paper">
              {c.stories.sticker}
            </Sticker>
          </div>
        </div>
      </ZineSection>

      {/* ================= PULL QUOTE BREAK ================= */}
      <ZineSection tone="bright" tight className="quote-break">
        <div className="wrap">
          <PullQuote cite={c.quote.cite}>
            <Rich text={c.quote.quote} />
          </PullQuote>
        </div>
      </ZineSection>

      {/* ================= EVENTS ================= */}
      <ZineSection tone="blue" torn="top" className="home-events">
        <div className="wrap wrap--wide">
          <SectionHead
            number="03"
            kicker={nextEvents.length ? c.events.kickerUpcoming : c.events.kickerNone}
          />
          <div className="home-events__head">
            <EditorialHeadline size={2}>
              <Rich text={c.events.headline} />
            </EditorialHeadline>
            <p className="lead">
              <Rich text={nextEvents.length ? c.events.leadUpcoming : c.events.leadNone} />
            </p>
          </div>

          <div className="home-events__wall">
            {(nextEvents.length ? nextEvents : lastTime).map((e, i) => (
              <Link key={e.id} href={`/events/${e.slug}`} className="home-events__link">
                <FlyerEventCard event={e} index={i} />
              </Link>
            ))}
            {!nextEvents.length && (
              <div className="home-events__empty">
                <p className="home-events__empty-head">{c.events.emptyHead}</p>
                <p>
                  <Rich text={c.events.emptyBody} />
                </p>
                <a href={contactMailto(c.events.emptySubject)} className="btn btn--yellow">
                  {c.events.emptyCta}
                </a>
              </div>
            )}
          </div>

          <div className="home-events__foot">
            <Link href="/events" className="btn btn--yellow">
              {c.events.all}
            </Link>
            <Link href="/regions/minnesota" className="btn btn--paper">
              {c.events.region}
            </Link>
          </div>
        </div>
      </ZineSection>

      {/* ================= COMMUNITY-LED ================= */}
      <ZineSection tone="paper" className="principle">
        <div className="wrap wrap--wide principle__inner">
          <PaperCard tilt="hair" shadow="slab" className="principle__card">
            <TapeStrip position="top-center" variant="kraft" width={140} />
            <span className="eyebrow">{c.principle.eyebrow}</span>
            {/* sentence case is required here, not stylistic — uppercase would
                flatten the deliberate “DoKAD” / “DoKADs” casing */}
            <EditorialHeadline size={2} sentence className="principle__head">
              <Rich text={shared.principle.headline} />
            </EditorialHeadline>
            <p className="measure">
              <Rich text={shared.principle.body} />
            </p>
            <div className="principle__ctas">
              <Link href="/about" className="btn btn--ghost">
                {c.principle.about}
              </Link>
              <Link href="/guidelines" className="btn btn--ghost">
                {c.principle.guidelines}
              </Link>
            </div>
          </PaperCard>

          <div className="principle__aside">
            <HandwrittenNote color="red" tiltDir={-1}>
              {c.principle.note}
            </HandwrittenNote>
            <CollageFrame seed="principle-art" variant="arc" ratio="1 / 1" />
          </div>
        </div>
      </ZineSection>

      {/* ================= JOIN ================= */}
      <ZineSection tone="red" torn="top" className="home-join">
        <div className="wrap wrap--wide home-join__inner">
          <div>
            <span className="eyebrow">{c.join.eyebrow}</span>
            <EditorialHeadline size="display">
              <Rich text={c.join.headline} />
            </EditorialHeadline>
            <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
              <Rich text={c.join.lead} />
            </p>
            <div className="home-join__ctas">
              <Link href="/join" className="btn btn--yellow btn--lg">
                {c.join.cta}
              </Link>
              <Link href="/share" className="btn btn--ghost">
                {c.join.share}
              </Link>
            </div>
          </div>
          <div className="home-join__deco" aria-hidden="true">
            {c.join.stickers.map((label, i) => (
              <Sticker
                key={label}
                color={STICKER_COLORS[i % STICKER_COLORS.length]}
                large
                tiltDir={i % 2 === 1 ? 1 : undefined}
              >
                {label}
              </Sticker>
            ))}
          </div>
        </div>
      </ZineSection>
    </>
  )
}
