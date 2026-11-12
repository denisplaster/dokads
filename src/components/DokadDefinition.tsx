import Link from 'next/link'
import { HandwrittenNote, PaperCard, Sticker, TapeStrip } from './zine'
import { Rich } from './Rich'
import type { Copy } from '../content/copy'

export type DefinitionText = Copy<'shared'>['definition']

/**
 * The definition card. Drop this anywhere the term “DoKAD” appears
 * prominently — the research was clear that most visitors have never
 * seen the word before and some avoid it because they are unsure it
 * applies to them.
 *
 * The words come in as a prop (copy('shared').definition) rather than being
 * read here, because this card also renders inside client components.
 */
export function DokadDefinition({
  text,
  variant = 'card',
  showCta = true,
}: {
  text: DefinitionText
  variant?: 'card' | 'strip'
  showCta?: boolean
}) {
  if (variant === 'strip') {
    return (
      <aside className="def-strip" data-tone="yellow">
        <span className="def-strip__term">DoKAD</span>
        <span className="def-strip__body">
          <Rich text={text.strip} />
        </span>
        {showCta && (
          <Link href="/am-i-a-dokad" className="def-strip__link">
            {text.stripLink}
          </Link>
        )}
      </aside>
    )
  }

  return (
    <PaperCard className="def-card" tilt="hair" tiltDir={-1} shadow="slab">
      <TapeStrip position="top-right" variant="clear" width={110} />
      <p className="def-card__label">{text.label}</p>
      <p className="def-card__term">
        DoKAD <span className="def-card__pron">{text.pronunciation}</span>
      </p>
      <p className="def-card__pos">{text.partOfSpeech}</p>
      <p className="def-card__def">
        <Rich text={text.first} />
      </p>
      <p className="def-card__def def-card__def--2">
        <Rich text={text.second} />
      </p>
      <div className="def-card__foot">
        {showCta && (
          <Sticker to="/am-i-a-dokad" color="red">
            {text.cta}
          </Sticker>
        )}
        <HandwrittenNote tiltDir={1}>{text.note}</HandwrittenNote>
      </div>
    </PaperCard>
  )
}
