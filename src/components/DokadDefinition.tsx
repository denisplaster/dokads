import { Link } from 'react-router-dom'
import { HandwrittenNote, PaperCard, Sticker, TapeStrip } from './zine'

/**
 * The definition card. Drop this anywhere the term “DoKAD” appears
 * prominently — the research was clear that most visitors have never
 * seen the word before and some avoid it because they are unsure it
 * applies to them.
 */
export function DokadDefinition({
  variant = 'card',
  showCta = true,
}: {
  variant?: 'card' | 'inline' | 'strip'
  showCta?: boolean
}) {
  if (variant === 'inline') {
    return (
      <p className="def-inline">
        <strong>DoKAD:</strong> a descendant of a Korean adoptee — the child, grandchild, or
        great-grandchild of someone adopted from Korea.
      </p>
    )
  }

  if (variant === 'strip') {
    return (
      <aside className="def-strip" data-tone="yellow">
        <span className="def-strip__term">DoKAD</span>
        <span className="def-strip__body">
          <em>noun.</em> A descendant of a Korean adoptee. Say it “DOH-kad.”
        </span>
        {showCta && (
          <Link to="/am-i-a-dokad" className="def-strip__link">
            Am I one? →
          </Link>
        )}
      </aside>
    )
  }

  return (
    <PaperCard className="def-card" tilt="hair" tiltDir={-1} shadow="slab">
      <TapeStrip position="top-right" variant="clear" width={110} />
      <p className="def-card__label">What is a DoKAD?</p>
      <p className="def-card__term">
        DoKAD <span className="def-card__pron">/ DOH-kad /</span>
      </p>
      <p className="def-card__pos">noun</p>
      <p className="def-card__def">
        A <strong>descendant of a Korean adoptee</strong>. Most often the child of someone
        adopted from Korea — sometimes the grandchild, sometimes further down.
      </p>
      <p className="def-card__def def-card__def--2">
        If your parent or grandparent was adopted from Korea, that is you. There is no test to
        pass and no box you have to tick.
      </p>
      <div className="def-card__foot">
        {showCta && (
          <Sticker to="/am-i-a-dokad" color="red">
            Am I a DoKAD?
          </Sticker>
        )}
        <HandwrittenNote tiltDir={1}>never heard it before? same.</HandwrittenNote>
      </div>
    </PaperCard>
  )
}
