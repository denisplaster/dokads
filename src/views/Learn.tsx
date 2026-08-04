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
  ZineSection,
  rot,
} from '../components/zine'
import { DokadDefinition } from '../components/DokadDefinition'
import { pillars } from '../data/pillars'
import { TOPIC_GROUPS, LEGAL_DISCLAIMER, LEGAL_RULES, topics } from '../data/topics'
import type { Topic } from '../data/topics'

const STATUS_LABEL: Record<Topic['status'], { label: string; color: string }> = {
  published: { label: 'Published', color: 'green' },
  drafting: { label: 'Being written', color: 'yellow' },
  planned: { label: 'Planned', color: 'paper' },
  'needs review': { label: 'Needs review', color: 'red' },
}

export function Learn() {
  const groups = Object.keys(TOPIC_GROUPS) as Topic['group'][]

  return (
    <>
      <ZineSection tone="lavender" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            The big{' '}
            <br />
            questions.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            Who, what, where, and why — the long versions. Plus everything we are working on
            writing next.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="red" tiltDir={1}>
              none of this is homework
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* the four pillars, in full */}
      {pillars.map((p, i) => (
        <ZineSection
          key={p.id}
          id={p.id}
          tone={i % 2 === 0 ? 'paper' : 'bright'}
          className="pillar-long"
        >
          <div className="wrap wrap--wide pillar-long__inner">
            <div className="pillar-long__art">
              <div data-tone={p.tone} style={{ background: 'var(--surface)', padding: 'var(--s-3)' }}>
                <CollageFrame seed={`learn-${p.id}`} variant={p.art} ratio="1 / 1" />
              </div>
              <p className="caption">
                <strong>Fig. {p.number}</strong> — {p.question} Artwork is generated, not
                photographic; we are waiting on the community for real images.
              </p>
            </div>
            <div className="pillar-long__body">
              <SectionHead number={p.number} kicker={p.question} />
              <EditorialHeadline size={1} className="pillar-long__word">
                {p.word}
              </EditorialHeadline>
              <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
                {p.body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              <ul className="pillar-long__points">
                {p.points.map((pt, j) => (
                  <li key={pt} style={rot('hair', j % 2 === 0 ? 1 : -1)}>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ZineSection>
      ))}

      <ZineSection tone="ink" torn="both" className="learn-quote">
        <div className="wrap">
          <PullQuote cite="The premise of this whole thing">
            The questions did not end with the first generation. They moved.
          </PullQuote>
        </div>
      </ZineSection>

      {/* topic queue */}
      <ZineSection tone="paper" id="topics" className="learn-topics">
        <div className="wrap wrap--wide">
          <SectionHead number="05" kicker="What we are writing next" />
          <div className="learn-topics__intro">
            <p className="lead">
              An open editorial queue. If something here matters to you, tell us — the order is
              not fixed, and we would rather write what people actually need.
            </p>
            <DokadDefinition variant="strip" />
          </div>

          {groups.map((g) => {
            const list = topics.filter((t) => t.group === g)
            if (!list.length) return null
            return (
              <section key={g} id={g} className="topic-group" data-tone={TOPIC_GROUPS[g].tone}>
                <h3 className="topic-group__head">{TOPIC_GROUPS[g].label}</h3>
                <ul className="topic-group__list">
                  {list.map((t, i) => (
                    <li key={t.slug} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                      <article className="topic-card">
                        <div className="topic-card__head">
                          <h4>{t.title}</h4>
                          <Sticker
                            color={STATUS_LABEL[t.status].color as 'green'}
                            flat
                            tiltDir={i % 2 === 0 ? 1 : -1}
                          >
                            {STATUS_LABEL[t.status].label}
                          </Sticker>
                        </div>
                        <p>{t.blurb}</p>
                        {t.sensitive && (
                          <p className="topic-card__flag">
                            <strong>Held back on purpose.</strong> {LEGAL_DISCLAIMER}
                          </p>
                        )}
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </ZineSection>

      {/* editorial standards for sensitive content */}
      <ZineSection tone="peach" torn="top" className="learn-rules">
        <div className="wrap wrap--wide learn-rules__inner">
          <div>
            <SectionHead number="06" kicker="How we handle legal + immigration content" />
            <p className="prose">
              People ask about Korean citizenship, the F-4 visa, and residency more than almost
              anything else. It is also the easiest thing to get badly wrong, so anything we
              publish on it has to clear all five of these before it goes up.
            </p>
          </div>
          <PaperCard tilt="nudge" shadow="slab" className="learn-rules__card">
            <ol className="learn-rules__list">
              {LEGAL_RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
            <p className="learn-rules__disclaimer">{LEGAL_DISCLAIMER}</p>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="red" className="learn-close">
        <div className="wrap learn-close__inner">
          <EditorialHeadline size={1}>Something missing?</EditorialHeadline>
          <p className="lead">
            Tell us what you came here looking for and could not find. That is genuinely how
            this queue gets ordered.
          </p>
          <div className="learn-close__ctas">
            <Link href="/join" className="btn btn--yellow btn--lg">
              Join and tell us
            </Link>
            <Link href="/resources" className="btn btn--paper">
              Community resources
            </Link>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
