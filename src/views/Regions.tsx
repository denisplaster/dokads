import Link from 'next/link'
import {
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  LocationStamp,
  PaperCard,
  SectionHead,
  Sticker,
  ZineSection,
  rot,
} from '../components/zine'
import { REGION_STATUS_META } from '../data/regions'
import type { Region } from '../data/regions'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'
import { vocab } from '../content/vocab'

export function Regions({
  regions,
  eventCounts,
}: {
  regions: Region[]
  eventCounts: Record<string, number>
}) {
  const c = copy('regions')
  const live = regions.filter((r) => r.status !== 'interest')
  const waiting = regions.filter((r) => r.status === 'interest')

  return (
    <>
      <ZineSection tone="peach" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="blue" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="regions-live">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={c.live.kicker} />
          <div className="grid grid--2">
            {live.map((r, i) => {
              const meta = { ...REGION_STATUS_META[r.status], ...vocab.regionStatus(r.status) }
              const count = eventCounts[r.slug] ?? 0
              return (
                <PaperCard
                  key={r.slug}
                  className="region-card"
                  tilt={i % 2 === 0 ? 'nudge' : 'hair'}
                  tiltDir={i % 2 === 0 ? 1 : -1}
                  pickup
                  shadow="card"
                >
                  <div className="region-card__top">
                    <LocationStamp color={r.status === 'active' ? 'green' : 'red'}>
                      {r.country}
                    </LocationStamp>
                    <Sticker color={meta.tone as 'green'} flat>
                      {meta.label}
                    </Sticker>
                  </div>
                  <h3 className="region-card__name">{r.name}</h3>
                  {r.intro && (
                    <p className="region-card__intro">
                      <Rich text={r.intro} />
                    </p>
                  )}
                  <p className="region-card__count">
                    {count} {count === 1 ? c.live.one : c.live.many} {c.live.listed}
                  </p>
                  <Link href={`/regions/${r.slug}`} className="btn btn--ghost">
                    {c.live.open} {r.name}
                  </Link>
                </PaperCard>
              )
            })}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="ink" torn="both" className="regions-waiting">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker={c.waiting.kicker} />
          <p className="lead">
            <Rich text={c.waiting.lead} />
          </p>
          <ul className="regions-waiting__list">
            {waiting.map((r, i) => (
              <li key={r.slug} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                <span className="regions-waiting__name">{r.name}</span>
                <span className="regions-waiting__status">{c.waiting.status}</span>
              </li>
            ))}
          </ul>
          <div className="regions-waiting__cta">
            <Link href="/join" className="btn btn--yellow btn--lg">
              {c.waiting.cta}
            </Link>
            <HandwrittenNote color="paper" tiltDir={1}>
              {c.waiting.note}
            </HandwrittenNote>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
