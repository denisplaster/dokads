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

export function Regions({
  regions,
  eventCounts,
}: {
  regions: Region[]
  eventCounts: Record<string, number>
}) {
  const live = regions.filter((r) => r.status !== 'interest')
  const waiting = regions.filter((r) => r.status === 'interest')

  return (
    <>
      <ZineSection tone="peach" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            Where{' '}
            <br />
            we are.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            Korean adoptees were placed across four continents, so their descendants are
            scattered the same way. Most of us live nowhere near another DoKAD — which is why
            the online group is the real home base, and local chapters are a bonus.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="blue" tiltDir={1}>
              your city isn’t here? start it. →
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="regions-live">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Up and running" />
          <div className="grid grid--2">
            {live.map((r, i) => {
              const meta = REGION_STATUS_META[r.status]
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
                  {r.intro && <p className="region-card__intro">{r.intro}</p>}
                  <p className="region-card__count">
                    {count} {count === 1 ? 'event' : 'events'} listed
                  </p>
                  <Link href={`/regions/${r.slug}`} className="btn btn--ghost">
                    Open {r.name}
                  </Link>
                </PaperCard>
              )
            })}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="ink" torn="both" className="regions-waiting">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker="No organisers yet" />
          <p className="lead">
            These are on the map because people have asked, not because anything exists. A
            region only gets a real page when actual organisers and confirmed information are
            behind it — we are not going to fake a chapter into being.
          </p>
          <ul className="regions-waiting__list">
            {waiting.map((r, i) => (
              <li key={r.slug} style={rot('hair', i % 2 === 0 ? 1 : -1)}>
                <span className="regions-waiting__name">{r.name}</span>
                <span className="regions-waiting__status">gathering interest</span>
              </li>
            ))}
          </ul>
          <div className="regions-waiting__cta">
            <Link href="/join" className="btn btn--yellow btn--lg">
              Put your city on the map
            </Link>
            <HandwrittenNote color="paper" tiltDir={1}>
              two people is enough to start
            </HandwrittenNote>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
