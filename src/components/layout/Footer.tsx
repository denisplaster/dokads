import type { Route } from 'next'
import Link from 'next/link'
import { HandwrittenNote, IssueLabel, Sticker, TornEdge } from '../zine'
import { adminEnabled, CONTACT_EMAIL } from '../../lib/site-mode'
import { Wordmark } from '../zine/Wordmark'
import { copy } from '../../content/copy'

const COL1: Route[] = ['/start', '/am-i-a-dokad', '/learn', '/stories', '/events', '/resources']
const COL2 = ['/join', '/regions', '/regions/minnesota', '/share', '/stories#submit'] as Route[]
const COL3: Route[] = ['/about', '/guidelines', '/privacy']

function Links({ to, labels }: { to: Route[]; labels: { label: string }[] }) {
  return (
    <ul className="stack-tight">
      {to.map((href, i) => (
        <li key={href}>
          <Link href={href}>{labels[i]?.label}</Link>
        </li>
      ))}
    </ul>
  )
}

export function Footer() {
  const t = copy('shared').footer
  return (
    <footer className="site-footer zsec grain" data-tone="ink">
      <TornEdge side="top" />
      <div className="wrap wrap--wide site-footer__inner">
        <div className="site-footer__brand">
          <Wordmark size="lg" withNote />
          <a
            className="site-footer__powered"
            href="https://www.akconnection.com"
            target="_blank"
            rel="noreferrer"
          >
            {t.powered}
          </a>
          <p className="site-footer__tag">{t.tagline}</p>
          <Sticker to="/join" color="yellow" large>
            {t.join}
          </Sticker>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          <div>
            <h2 className="eyebrow">{t.col1}</h2>
            <Links to={COL1} labels={t.col1Links} />
          </div>
          <div>
            <h2 className="eyebrow">{t.col2}</h2>
            <Links to={COL2} labels={t.col2Links} />
          </div>
          <div>
            <h2 className="eyebrow">{t.col3}</h2>
            <ul className="stack-tight">
              {COL3.map((href, i) => (
                <li key={href}>
                  <Link href={href}>{t.col3Links[i]?.label}</Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="wrap wrap--wide site-footer__base">
        <IssueLabel />
        <HandwrittenNote color="paper" tiltDir={1}>
          {t.note}
        </HandwrittenNote>
        <p className="site-footer__legal">
          © {new Date().getFullYear()} {t.legal}
        </p>

        {/* Quiet on purpose: organisers need to find it, visitors do not need
            to wonder what it is. Sits last in the tab order. Hidden entirely in
            static mode, where /admin does not resolve. */}
        {adminEnabled() && (
        <Link href="/admin" className="site-footer__admin" title="Organiser sign-in">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M7 10V7a5 5 0 0 1 10 0v3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              x="4.5"
              y="10"
              width="15"
              height="10.5"
              rx="1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span>{t.admin}</span>
        </Link>
        )}
      </div>
    </footer>
  )
}
