'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import type { DefinitionText } from '../components/DokadDefinition'
import { Rich } from '../components/Rich'
import type { Copy } from '../content/copy'

/* ------------------------------------------------------------------ */
/* The generation diagram                                              */
/* ------------------------------------------------------------------ */

/** Colour and "could be you" per row; the words are editable. */
const ROWS: { id: string; tone: string; isYou?: boolean }[] = [
  { id: 'birth', tone: 'kraft' },
  { id: 'adoptee', tone: 'blue' },
  { id: 'child', tone: 'yellow', isYou: true },
  { id: 'grandchild', tone: 'peach', isYou: true },
  { id: 'future', tone: 'lavender' },
]

export type AmIaDokadText = Copy<'am-i-a-dokad'>

function GenerationTree({ t }: { t: AmIaDokadText['tree'] }) {
  const [open, setOpen] = useState<string | null>('child')
  const GENERATIONS = ROWS.map((r, i) => ({ ...r, ...t.rows[i] }))

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
              <span className="gentree__label">{g.label}</span>
              <span className="gentree__sub">{g.sub}</span>
              {g.isYou && <span className="gentree__flag">{t.flag}</span>}
              <span className="gentree__toggle" aria-hidden="true">
                {open === g.id ? '−' : '+'}
              </span>
            </button>
            {open === g.id && (
              <p className="gentree__detail">
                <Rich text={g.detail} />
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="gentree__caveat">
        <Rich text={t.caveat} />
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The checklist                                                       */
/* ------------------------------------------------------------------ */

const SOFT = 'figuring'

function Checklist({ t }: { t: AmIaDokadText['check'] }) {
  const EXAMPLES: { id: string; text: string; soft?: boolean }[] = [
    ...t.examples.map((text, i) => ({ id: `ex-${i}`, text })),
    ...(t.soft ? [{ id: SOFT, text: t.soft, soft: true }] : []),
  ]
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const answered = picked.length > 0
  const onlySoft = answered && picked.every((p) => p === SOFT)

  return (
    <div className="checklist">
      <fieldset className="checklist__set">
        <legend className="checklist__legend">{t.legend}</legend>
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
              <span className="checklist__text">
                <Rich text={ex.text} />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="checklist__result" aria-live="polite">
        {!answered && (
          <p className="checklist__waiting">
            <HandwrittenNote>{t.waiting}</HandwrittenNote>
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
            <EditorialHeadline size={2}>{onlySoft ? t.softHead : t.yesHead}</EditorialHeadline>
            <p style={{ marginTop: 'var(--s-4)' }}>
              <Rich text={onlySoft ? t.softBody : t.yesBody} />
            </p>
            <div className="checklist__ctas">
              <Link href="/join" className="btn btn--red">
                {t.ctaJoin}
              </Link>
              <Link href="/events" className="btn btn--ghost">
                {t.ctaEvents}
              </Link>
            </div>
          </PaperCard>
        )}
      </div>
    </div>
  )
}

const CLOSE_STICKERS = ['yellow', 'paper', 'red'] as const

/* ------------------------------------------------------------------ */

export function AmIaDokad({
  definition,
  text: c,
}: {
  definition: DefinitionText
  text: AmIaDokadText
}) {
  return (
    <>
      <ZineSection tone="yellow" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            {c.hero.headline}
            <br />
            <span className="knock">{c.hero.knockout}</span>
          </EditorialHeadline>
          <ScribbleUnderline color="red" variant={3} />
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandArrow turn={100} size={54} color="blue" />
            <HandwrittenNote tiltDir={1}>{c.hero.note}</HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="aiad-def">
        <div className="wrap wrap--wide aiad-def__inner">
          <DokadDefinition text={definition} showCta={false} />
          <div className="aiad-def__body">
            <SectionHead number="01" kicker={c.short.kicker} />
            {c.short.body.map((para) => (
              <p className="prose" key={para}>
                <Rich text={para} />
              </p>
            ))}
          </div>
        </div>
      </ZineSection>

      <ZineSection tone="bright" torn="both" className="aiad-tree">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker={c.tree.kicker} />
          <GenerationTree t={c.tree} />
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="aiad-check">
        <div className="wrap wrap--wide">
          <SectionHead number="03" kicker={c.check.kicker} />
          <Checklist t={c.check} />
        </div>
      </ZineSection>

      <ZineSection tone="ink" torn="top" className="aiad-close">
        <div className="wrap">
          <EditorialHeadline size={1} sentence className="aiad-close__head">
            <Rich text={c.close.headline} />
          </EditorialHeadline>
          <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
            <Rich text={c.close.lead} />
          </p>
          <div className="aiad-close__ctas">
            <Link href="/start" className="btn btn--yellow btn--lg">
              {c.close.ctaStart}
            </Link>
            <Link href="/join" className="btn btn--paper btn--lg">
              {c.close.ctaJoin}
            </Link>
            <Link href="/share" className="btn btn--ghost">
              {c.close.ctaShare}
            </Link>
          </div>
          <div className="aiad-close__stickers" aria-hidden="true">
            {c.close.stickers.map((label, i) => (
              <Sticker
                key={label}
                color={CLOSE_STICKERS[i % CLOSE_STICKERS.length]}
                tiltDir={i % 3 === 1 ? 1 : undefined}
              >
                {label}
              </Sticker>
            ))}
          </div>
          <p className="aiad-close__print">
            <Rich text={c.close.print} />
          </p>
        </div>
      </ZineSection>
    </>
  )
}
