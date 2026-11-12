import Link from 'next/link'
import {
  EditorialHeadline,
  HandwrittenNote,
  ScribbleUnderline,
  Sticker,
  ZineSection,
} from '../components/zine'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'

export function NotFound() {
  const t = copy('shared').notFound
  return (
    <ZineSection tone="ink" className="notfound">
      <div className="wrap notfound__inner">
        <p className="eyebrow">{t.eyebrow}</p>
        <EditorialHeadline size="mega" className="notfound__head">
          <Rich text={t.headline} />
        </EditorialHeadline>
        <ScribbleUnderline color="red" variant={2} />
        <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
          <Rich text={t.lead} />
        </p>
        <p style={{ marginTop: 'var(--s-4)' }}>
          <HandwrittenNote color="paper" tiltDir={1}>
            {t.note}
          </HandwrittenNote>
        </p>
        <div className="notfound__links">
          <Link href="/" className="btn btn--yellow btn--lg">
            {t.links[0]?.label}
          </Link>
          <Sticker to="/am-i-a-dokad" color="red" large>
            {t.links[1]?.label}
          </Sticker>
          <Sticker to="/stories" color="paper" large tiltDir={1}>
            {t.links[2]?.label}
          </Sticker>
          <Sticker to="/events" color="pink" large>
            {t.links[3]?.label}
          </Sticker>
        </div>
      </div>
    </ZineSection>
  )
}
