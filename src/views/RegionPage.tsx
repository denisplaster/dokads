import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  EditorialHeadline,
  FlyerEventCard,
  HandwrittenNote,
  IssueLabel,
  LocationStamp,
  PaperCard,
  PullQuote,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
} from '../components/zine'
import { REGION_STATUS_META, getRegion } from '../data/regions'
import { eventsInRegion, formatEventDate } from '../data/events'
import { COMMUNITY_LED_PRINCIPLE } from '../data/community'

export function RegionPage({ slug }: { slug: string }) {
  const region = getRegion(slug)
  if (!region || region.status === 'interest') notFound()

  const meta = REGION_STATUS_META[region.status]
  const list = eventsInRegion(region.slug)
  const isMinnesota = region.slug === 'minnesota'

  return (
    <>
      <ZineSection tone="blue" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <div className="region-hero__badges">
            <IssueLabel />
            <Sticker color="yellow">{meta.label}</Sticker>
            <LocationStamp color="ink">{region.country}</LocationStamp>
          </div>
          <EditorialHeadline size="display" className="page-hero__head">
            {region.name}
          </EditorialHeadline>
          {region.intro && <p className="lead page-hero__lead">{region.intro}</p>}
          {isMinnesota && (
            <p className="page-hero__aside">
              <HandwrittenNote color="paper" tiltDir={1}>
                first one’s in September (probably)
              </HandwrittenNote>
            </p>
          )}
        </div>
      </ZineSection>

      {/* events */}
      <ZineSection tone="paper" className="region-events">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Upcoming here" />
          {list.length === 0 ? (
            <PaperCard className="empty" tilt="nudge">
              <p>
                <strong>Nothing scheduled yet.</strong> Join the list and you will hear first.
              </p>
              <Link href="/join" className="btn btn--red" style={{ marginTop: 'var(--s-4)' }}>
                Join DOKADS
              </Link>
            </PaperCard>
          ) : (
            <div className="events-wall__grid">
              {list.map((e, i) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="home-events__link">
                  <FlyerEventCard event={e} index={i} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </ZineSection>

      {/* organisers + socials */}
      <ZineSection tone="bright" torn="both" className="region-people">
        <div className="wrap wrap--wide region-people__inner">
          <div>
            <SectionHead number="02" kicker="Who is running this" />
            {region.organisers?.length ? (
              <ul className="region-people__list">
                {region.organisers.map((o) => (
                  <li key={o.name}>
                    <strong>{o.name}</strong>
                    <span>{o.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="prose">Nobody yet. That could be you.</p>
            )}
            <PaperCard className="region-people__volunteer" tilt="hair" shadow="lift">
              <TapeStrip position="top-right" variant="kraft" width={90} />
              <h3>Want to help organise?</h3>
              <p>
                You do not need experience, a venue, or a plan. The first meetups are mostly
                about picking a coffee shop and showing up.
              </p>
              <Link href="/join" className="btn btn--red">
                Volunteer
              </Link>
            </PaperCard>
          </div>

          <div>
            <SectionHead number="03" kicker="Where the day-to-day happens" />
            <ul className="region-people__socials">
              {(region.socials ?? []).map((s) => (
                <li key={s.label}>
                  <span className="region-people__social-label">{s.label}</span>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noreferrer">
                      Open →
                    </a>
                  ) : (
                    <span className="region-people__pending">{s.note ?? 'Coming soon'}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="region-people__privacy">
              <strong>A note on outside platforms.</strong> Facebook and Instagram groups are
              run on someone else’s infrastructure, under their privacy terms and their data
              collection — not ours. Anything you post there is subject to their rules. This
              website stays the permanent, searchable home for information; the social groups
              are just where conversation happens day to day.
            </p>
          </div>
        </div>
      </ZineSection>

      {/* updates */}
      {region.updates?.length ? (
        <ZineSection tone="acid" className="region-updates">
          <div className="wrap wrap--wide">
            <SectionHead number="04" kicker="Community updates" />
            <ol className="region-updates__list">
              {region.updates.map((u) => (
                <li key={u.date}>
                  <span className="region-updates__date">{formatEventDate(u.date)}</span>
                  <span>{u.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </ZineSection>
      ) : null}

      {/* Minnesota-specific: partners + principle */}
      {isMinnesota && (
        <ZineSection tone="paper" torn="top" className="region-partners">
          <div className="wrap wrap--wide region-partners__inner">
            <div>
              <SectionHead number="05" kicker="On other organisations" />
              <div className="prose">
                <p>
                  Minnesota has one of the largest Korean adoptee populations anywhere, and
                  there are adoptee-led organisations here — including AK Connection — that have
                  been doing this work far longer than we have.
                </p>
                <p>
                  We would like to work alongside them. But we are not going to describe anyone
                  as a partner before that relationship is actually agreed, and{' '}
                  <strong>
                    being here does not mean you are connected to any other organisation
                  </strong>
                  . Plenty of DoKADs have never heard of any of them.
                </p>
              </div>
            </div>
            <PaperCard className="region-partners__card" tilt="nudge" tiltDir={-1} shadow="slab">
              <span className="eyebrow">Community principle</span>
              <PullQuote body>{COMMUNITY_LED_PRINCIPLE.headline}</PullQuote>
              <p style={{ marginTop: 'var(--s-4)' }}>{COMMUNITY_LED_PRINCIPLE.body}</p>
              <Link href="/about" className="btn btn--ghost" style={{ marginTop: 'var(--s-4)' }}>
                Read more
              </Link>
            </PaperCard>
          </div>
        </ZineSection>
      )}

      <ZineSection tone="red" className="region-close">
        <div className="wrap region-close__inner">
          <EditorialHeadline size={1}>Get {region.name} updates</EditorialHeadline>
          <p className="lead">
            Local email updates only — you can pick this region specifically on the join form.
          </p>
          <Link href="/join" className="btn btn--yellow btn--lg">
            Join DOKADS
          </Link>
        </div>
      </ZineSection>
    </>
  )
}
