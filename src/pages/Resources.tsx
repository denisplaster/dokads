import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { AUDIENCES, FORMATS, resources } from '../data/resources'
import type { Audience, ResourceFormat } from '../data/resources'

export function Resources() {
  const [format, setFormat] = useState<ResourceFormat | 'all'>('all')
  const [audience, setAudience] = useState<Audience | 'all'>('all')

  const list = useMemo(
    () =>
      resources.filter(
        (r) =>
          (format === 'all' || r.format === format) &&
          (audience === 'all' || r.audience.includes(audience)),
      ),
    [format, audience],
  )

  return (
    <>
      <ZineSection tone="kraft" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            The reading{' '}
            <br />
            pile.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            Not a database — a set of shelves the community fills in. Books, films, podcasts,
            organisations, and the practical stuff nobody hands you.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="red" tiltDir={1}>
              recommend something ↓
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" tight className="resources-note">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift" ruled>
            <TapeStrip position="top-left" variant="kraft" width={120} />
            <span className="eyebrow">Why this looks empty</span>
            <p>
              <strong>Every shelf below is an open call.</strong> We describe what each one is
              for; the community fills it with actual titles. We would rather show you honest
              empty shelves than pad the list with things nobody here has read.
            </p>
            <p>
              Anything about immigration, citizenship, visas, or law gets checked and dated
              before it goes up — see how we handle that on{' '}
              <Link to="/learn#topics">the learn page</Link>.
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      <ZineSection tone="bright" torn="both" className="resources-list">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Browse the shelves" />

          <div className="filters">
            <div className="filters__row" role="group" aria-label="Filter by format">
              <span className="filters__label">Format</span>
              <button
                type="button"
                className={`filterbar__chip ${format === 'all' ? 'is-on' : ''}`}
                aria-pressed={format === 'all'}
                onClick={() => setFormat('all')}
              >
                Everything
              </button>
              {(Object.keys(FORMATS) as ResourceFormat[]).map((f, i) => (
                <button
                  key={f}
                  type="button"
                  className={`filterbar__chip ${format === f ? 'is-on' : ''}`}
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                  style={rot('hair', i % 2 === 0 ? 1 : -1)}
                >
                  {FORMATS[f].verb}
                </button>
              ))}
            </div>

            <div className="filters__row" role="group" aria-label="Filter by who it is for">
              <span className="filters__label">Who for</span>
              <button
                type="button"
                className={`filterbar__chip ${audience === 'all' ? 'is-on' : ''}`}
                aria-pressed={audience === 'all'}
                onClick={() => setAudience('all')}
              >
                Anyone
              </button>
              {(Object.keys(AUDIENCES) as Audience[]).map((a, i) => (
                <button
                  key={a}
                  type="button"
                  className={`filterbar__chip ${audience === a ? 'is-on' : ''}`}
                  aria-pressed={audience === a}
                  onClick={() => setAudience(a)}
                  style={rot('hair', i % 2 === 0 ? -1 : 1)}
                >
                  {AUDIENCES[a]}
                </button>
              ))}
            </div>
          </div>

          <p className="filterbar__count" aria-live="polite">
            {list.length} {list.length === 1 ? 'shelf' : 'shelves'}
          </p>

          <div className="resources-grid">
            {list.map((r, i) => (
              <article
                key={r.id}
                className={`res-card res-card--${r.card}`}
                style={rot(i % 3 === 0 ? 'nudge' : 'hair', i % 2 === 0 ? 1 : -1)}
              >
                {r.badge && (
                  <span className="res-card__badge">
                    <Sticker color={r.badge === 'Start here' ? 'red' : 'yellow'} flat>
                      {r.badge}
                    </Sticker>
                  </span>
                )}
                <span className="res-card__format">{FORMATS[r.format].verb}</span>
                <h3 className="res-card__title">{r.title}</h3>
                <p className="res-card__blurb">{r.blurb}</p>
                <div className="res-card__foot">
                  <span className="res-card__audience">
                    {r.audience.map((a) => AUDIENCES[a]).join(' · ')}
                  </span>
                  <span className="res-card__status">Open call</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="ink" id="suggest" torn="top" className="resources-suggest">
        <div className="wrap wrap--wide resources-suggest__inner">
          <div>
            <SectionHead number="02" kicker="Suggest something" />
            <EditorialHeadline size={1}>
              What got you{' '}
              <br />
              through?
            </EditorialHeadline>
            <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
              <p>
                A book, a film, a podcast episode, an organisation, a single blog post from
                2011. If it helped you understand your family, your parent, Korea, or yourself,
                it belongs on a shelf here.
              </p>
              <p>
                Tell us which shelf, what it is, and one line on why. We will credit you or not,
                whichever you prefer.
              </p>
            </div>
          </div>
          <div className="resources-suggest__stickers">
            {(Object.keys(FORMATS) as ResourceFormat[]).map((f, i) => (
              <Sticker
                key={f}
                color={(['yellow', 'pink', 'acid', 'peach', 'lavender', 'green'] as const)[i % 6]}
                large
                tiltDir={i % 2 === 0 ? 1 : -1}
              >
                {FORMATS[f].verb}
              </Sticker>
            ))}
            <Link to="/join" className="btn btn--yellow btn--lg">
              Send a recommendation
            </Link>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
