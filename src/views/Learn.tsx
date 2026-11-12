import type { Route } from 'next'
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
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'
import { pillarList } from '../content/derived'
import { TOPIC_STATUS_OPTIONS } from '../content/pages/learn'
import { TOPIC_GROUPS } from '../data/topics'
import type { Topic } from '../data/topics'

const STATUS_COLOR: Record<Topic['status'], 'green' | 'yellow' | 'paper' | 'red'> = {
  published: 'green',
  drafting: 'yellow',
  planned: 'paper',
  'needs review': 'red',
}

export function Learn() {
  const c = copy('learn')
  const shared = copy('shared')
  const pillars = pillarList()
  const groups = Object.keys(TOPIC_GROUPS) as Topic['group'][]
  const groupLabel = (g: Topic['group']) => c.topics.groups[groups.indexOf(g)]?.label ?? g
  const statusLabel = (s: string) =>
    c.topics.statusLabels[TOPIC_STATUS_OPTIONS.findIndex((o) => o.value === s)]?.label ?? s
  const topics = c.topics.list
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
          <p className="page-hero__aside">
            <HandwrittenNote color="red" tiltDir={1}>
              {c.hero.note}
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
                <strong>
                  {c.hero.figure} {p.number}
                </strong>{' '}
                — {p.question} {c.hero.caption}
              </p>
            </div>
            <div className="pillar-long__body">
              <SectionHead number={p.number} kicker={p.question} />
              <EditorialHeadline size={1} className="pillar-long__word">
                {p.word}
              </EditorialHeadline>
              <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
                {p.body.map((para) => (
                  <p key={para.slice(0, 24)}>
                    <Rich text={para} />
                  </p>
                ))}
              </div>
              <ul className="pillar-long__points">
                {p.points.map((pt, j) => (
                  <li key={pt} style={rot('hair', j % 2 === 0 ? 1 : -1)}>
                    <Rich text={pt} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ZineSection>
      ))}

      <ZineSection tone="ink" torn="both" className="learn-quote">
        <div className="wrap">
          <PullQuote cite={c.quote.cite}>
            <Rich text={c.quote.quote} />
          </PullQuote>
        </div>
      </ZineSection>

      {/* topic queue */}
      <ZineSection tone="paper" id="topics" className="learn-topics">
        <div className="wrap wrap--wide">
          <SectionHead number="05" kicker={c.topics.kicker} />
          <div className="learn-topics__intro">
            <p className="lead">
              <Rich text={c.topics.lead} />
            </p>
            <DokadDefinition text={shared.definition} variant="strip" />
          </div>

          {groups.map((g) => {
            const list = topics.filter((t) => t.group === g)
            if (!list.length) return null
            return (
              <section key={g} id={g} className="topic-group" data-tone={TOPIC_GROUPS[g].tone}>
                <h3 className="topic-group__head">{groupLabel(g)}</h3>
                <ul className="topic-group__list">
                  {list.map((t, i) => (
                    <li key={`${t.title}-${i}`} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                      <article className="topic-card">
                        <div className="topic-card__head">
                          <h4>
                            {t.href ? (
                              <Link href={t.href as Route} className="topic-card__link">
                                {t.title}
                              </Link>
                            ) : (
                              t.title
                            )}
                          </h4>
                          <Sticker
                            color={STATUS_COLOR[t.status as Topic['status']] ?? 'paper'}
                            flat
                            tiltDir={i % 2 === 0 ? 1 : -1}
                          >
                            {statusLabel(t.status)}
                          </Sticker>
                        </div>
                        <p>
                          <Rich text={t.blurb} />
                        </p>
                        {t.sensitive === 'yes' && (
                          <p className="topic-card__flag">
                            {t.status !== 'published' && c.topics.sensitiveFlag && (
                              <>
                                <strong>{c.topics.sensitiveFlag}</strong>{' '}
                              </>
                            )}
                            <Rich text={shared.legal.disclaimer} />
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
            <SectionHead number="06" kicker={c.rules.kicker} />
            <p className="prose">
              <Rich text={c.rules.body} />
            </p>
          </div>
          <PaperCard tilt="nudge" shadow="slab" className="learn-rules__card">
            <ol className="learn-rules__list">
              {shared.legal.rules.map((r) => (
                <li key={r}>
                  <Rich text={r} />
                </li>
              ))}
            </ol>
            <p className="learn-rules__disclaimer">
              <Rich text={shared.legal.disclaimer} />
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="red" className="learn-close">
        <div className="wrap learn-close__inner">
          <EditorialHeadline size={1}>
            <Rich text={c.close.headline} />
          </EditorialHeadline>
          <p className="lead">
            <Rich text={c.close.lead} />
          </p>
          <div className="learn-close__ctas">
            <Link href="/join" className="btn btn--yellow btn--lg">
              {c.close.cta}
            </Link>
            <Link href="/resources" className="btn btn--paper">
              {c.close.resources}
            </Link>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
