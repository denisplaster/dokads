import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EditorialHeadline,
  HandArrow,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  ScribbleUnderline,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { DokadDefinition } from '../components/DokadDefinition'

/* ------------------------------------------------------------------ */
/* The generation diagram                                              */
/* ------------------------------------------------------------------ */

type Gen = {
  id: string
  label: string
  sub: string
  tone: string
  detail: string
  isYou?: boolean
}

const GENERATIONS: Gen[] = [
  {
    id: 'birth',
    label: 'Korean birth family',
    sub: 'In Korea',
    tone: 'kraft',
    detail:
      'Sometimes known, more often not. Many adoptees have little or no information here, and many DoKADs grow up with this part of the tree simply blank.',
  },
  {
    id: 'adoptee',
    label: 'Korean adoptee',
    sub: 'Adopted from Korea, raised abroad',
    tone: 'blue',
    detail:
      'Your parent or grandparent. Roughly 200,000 people were adopted out of Korea from the 1950s onward — most to the United States and Western Europe.',
  },
  {
    id: 'child',
    label: 'Child of a Korean adoptee',
    sub: 'This is a DoKAD',
    tone: 'yellow',
    isYou: true,
    detail:
      'If your mother or father was adopted from Korea, this is you. It is the most common way into this community.',
  },
  {
    id: 'grandchild',
    label: 'Grandchild of a Korean adoptee',
    sub: 'Also a DoKAD',
    tone: 'peach',
    isYou: true,
    detail:
      'If your grandparent was adopted from Korea, this is you too. The generation gap does not disqualify anyone.',
  },
  {
    id: 'future',
    label: 'Future generations',
    sub: 'Still DoKADs',
    tone: 'lavender',
    detail:
      'Great-grandchildren and onward. The history keeps travelling, and so does the invitation.',
  },
]

function GenerationTree() {
  const [open, setOpen] = useState<string | null>('child')

  return (
    <div className="gentree">
      <ol className="gentree__list">
        {GENERATIONS.map((g, i) => (
          <li key={g.id} className="gentree__row">
            {i > 0 && (
              <svg
                className="gentree__connector"
                viewBox="0 0 40 60"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M20 2c-4 14 5 26 1 38-1 6-2 12-1 18" />
              </svg>
            )}
            <button
              type="button"
              className={`gentree__node ${open === g.id ? 'is-open' : ''} ${g.isYou ? 'gentree__node--you' : ''}`}
              data-tone={g.tone}
              aria-expanded={open === g.id}
              onClick={() => setOpen(open === g.id ? null : g.id)}
              style={rot('hair', i % 2 === 0 ? 1 : -1)}
            >
              <span className="gentree__gen">Gen {i + 1}</span>
              <span className="gentree__label">{g.label}</span>
              <span className="gentree__sub">{g.sub}</span>
              {g.isYou && <span className="gentree__flag">could be you</span>}
              <span className="gentree__toggle" aria-hidden="true">
                {open === g.id ? '−' : '+'}
              </span>
            </button>
            {open === g.id && <p className="gentree__detail">{g.detail}</p>}
          </li>
        ))}
      </ol>
      <p className="gentree__caveat">
        <strong>This diagram is simplified.</strong> Real families are messier than five boxes
        in a column — step-families, adoptions in more than one generation, relatives who are
        not on any paperwork, people raised by someone other than a parent. If the shape of
        your family is not on here, that does not mean you are not.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The checklist                                                       */
/* ------------------------------------------------------------------ */

const EXAMPLES = [
  { id: 'mother', text: 'My mother was adopted from Korea' },
  { id: 'father', text: 'My father was adopted from Korea' },
  { id: 'one-or-both', text: 'One or both of my parents are Korean adoptees' },
  { id: 'grandparent', text: 'My grandparent was adopted from Korea' },
  { id: 'more-than-one', text: 'More than one person in my family was adopted from Korea' },
  { id: 'figuring', text: 'I am still figuring out how this history relates to me', soft: true },
]

function Checklist() {
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const answered = picked.length > 0
  const onlySoft = answered && picked.every((p) => p === 'figuring')

  return (
    <div className="checklist">
      <fieldset className="checklist__set">
        <legend className="checklist__legend">Tick anything that sounds like you</legend>
        <div className="checklist__grid">
          {EXAMPLES.map((ex, i) => (
            <label
              key={ex.id}
              className={`checklist__item ${picked.includes(ex.id) ? 'is-picked' : ''} ${ex.soft ? 'checklist__item--soft' : ''}`}
              style={rot('hair', i % 2 === 0 ? 1 : -1)}
            >
              <input
                type="checkbox"
                checked={picked.includes(ex.id)}
                onChange={() => toggle(ex.id)}
              />
              <span className="checklist__box" aria-hidden="true" />
              <span className="checklist__text">{ex.text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="checklist__result" aria-live="polite">
        {!answered && (
          <p className="checklist__waiting">
            <HandwrittenNote>pick as many as you like — or none</HandwrittenNote>
          </p>
        )}
        {answered && (
          <PaperCard
            className="checklist__card"
            tilt="nudge"
            tiltDir={-1}
            shadow="slab"
            data-tone={onlySoft ? 'lavender' : 'acid'}
            style={{ background: 'var(--surface)' }}
          >
            <TapeStrip position="top-left" variant="clear" />
            <EditorialHeadline size={2}>
              {onlySoft ? 'That counts too.' : 'Then yes — that’s you.'}
            </EditorialHeadline>
            <p style={{ marginTop: 'var(--s-4)' }}>
              {onlySoft
                ? 'Plenty of people show up here without a clear sense of whether it applies to them, or how much they want it to. You do not have to resolve that before joining anything. Come and be uncertain in company.'
                : 'You are a descendant of a Korean adoptee — a DoKAD, if you want the word. You do not have to use the term, identify with it, feel any particular way about Korea, or know anything about your family history to take part.'}
            </p>
            <div className="checklist__ctas">
              <Link to="/join" className="btn btn--red">
                Join DOKADS
              </Link>
              <Link to="/events" className="btn btn--ghost">
                See what’s coming up
              </Link>
            </div>
          </PaperCard>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function AmIaDokad() {
  return (
    <>
      <ZineSection tone="yellow" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel prefix="DOKADS" issue="001" />
          <EditorialHeadline size="display" className="page-hero__head">
            Am I a<br />
            <span className="knock">DoKAD?</span>
          </EditorialHeadline>
          <ScribbleUnderline color="red" variant={3} />
          <p className="lead page-hero__lead">
            Probably a fair question, since most people have never heard the word. Here is the
            whole thing in about thirty seconds.
          </p>
          <p className="page-hero__aside">
            <HandArrow turn={100} size={54} color="blue" />
            <HandwrittenNote tiltDir={1}>
              no test. no proof. no forms about your family.
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="aiad-def">
        <div className="wrap wrap--wide aiad-def__inner">
          <DokadDefinition showCta={false} />
          <div className="aiad-def__body">
            <SectionHead number="01" kicker="The short version" />
            <p className="prose">
              A DoKAD is a <strong>descendant of a Korean adoptee</strong>. If your parent or
              your grandparent was adopted from Korea, you are one.
            </p>
            <p className="prose">
              That is the entire definition. It does not depend on whether you speak Korean,
              whether you have been to Korea, whether people read you as Korean, whether you
              are mixed race, whether you know anything about your family before the adoption,
              or whether you have ever thought about any of this before today.
            </p>
            <p className="prose">
              Some people use the word about themselves straight away. Some never use it and
              just come to things. Both are completely normal.
            </p>
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="bright" torn="both" className="aiad-tree">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker="Where you might sit" />
          <GenerationTree />
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="aiad-check">
        <div className="wrap wrap--wide">
          <SectionHead number="03" kicker="Try it against your own family" />
          <Checklist />
        </div>
      </ZineSection>

      <ZineSection tone="ink" torn="top" className="aiad-close">
        <div className="wrap">
          <EditorialHeadline size={1} sentence className="aiad-close__head">
            There is no test you need to pass and no single way to identify as a DoKAD.
          </EditorialHeadline>
          <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
            Come as you are, including unsure. You can read everything here without telling us
            anything about yourself.
          </p>
          <div className="aiad-close__ctas">
            <Link to="/start" className="btn btn--yellow btn--lg">
              Start here
            </Link>
            <Link to="/join" className="btn btn--paper btn--lg">
              Join DOKADS
            </Link>
            <Link to="/share" className="btn btn--ghost">
              Send this to someone
            </Link>
          </div>
          <div className="aiad-close__stickers" aria-hidden="true">
            <Sticker color="yellow">Print it</Sticker>
            <Sticker color="paper" tiltDir={1}>
              Share it
            </Sticker>
            <Sticker color="red">QR it</Sticker>
          </div>
          <p className="aiad-close__print">
            This page is built to work as a handout too — use your browser’s print option for a
            clean one-page version, or grab the assets on the{' '}
            <Link to="/share">Share DOKADS</Link> page.
          </p>
        </div>
      </ZineSection>
    </>
  )
}
