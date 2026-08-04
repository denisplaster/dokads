import { Link } from 'react-router-dom'
import {
  EditorialHeadline,
  HandwrittenNote,
  ScribbleUnderline,
  Sticker,
  ZineSection,
} from '../components/zine'

export function NotFound() {
  return (
    <ZineSection tone="ink" className="notfound">
      <div className="wrap notfound__inner">
        <p className="eyebrow">Error 404</p>
        <EditorialHeadline size="mega" className="notfound__head">
          Not{' '}
          <br />
          here.
        </EditorialHeadline>
        <ScribbleUnderline color="red" variant={2} />
        <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
          This page does not exist, or it moved, or it was never made. Happens.
        </p>
        <p style={{ marginTop: 'var(--s-4)' }}>
          <HandwrittenNote color="paper" tiltDir={1}>
            try one of these instead →
          </HandwrittenNote>
        </p>
        <div className="notfound__links">
          <Link to="/" className="btn btn--yellow btn--lg">
            Home
          </Link>
          <Sticker to="/am-i-a-dokad" color="red" large>
            Am I a DoKAD?
          </Sticker>
          <Sticker to="/stories" color="paper" large tiltDir={1}>
            Stories
          </Sticker>
          <Sticker to="/events" color="pink" large>
            Events
          </Sticker>
        </div>
      </div>
    </ZineSection>
  )
}
