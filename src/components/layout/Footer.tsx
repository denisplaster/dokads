import Link from 'next/link'
import { HandwrittenNote, IssueLabel, Sticker, TornEdge } from '../zine'
import { Wordmark } from '../zine/Wordmark'

export function Footer() {
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
            Powered by AK Connection
          </a>
          <p className="site-footer__tag">
            For the next generation of Korean adoption stories.
          </p>
          <Sticker to="/join" color="yellow" large>
            Join DOKADS
          </Sticker>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          <div>
            <h2 className="eyebrow">The zine</h2>
            <ul className="stack-tight">
              <li>
                <Link href="/start">Start here</Link>
              </li>
              <li>
                <Link href="/am-i-a-dokad">Am I a DoKAD?</Link>
              </li>
              <li>
                <Link href="/learn">Learn</Link>
              </li>
              <li>
                <Link href="/stories">Stories</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/resources">Resources</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Take part</h2>
            <ul className="stack-tight">
              <li>
                <Link href="/join">Join the community</Link>
              </li>
              <li>
                <Link href="/regions">Local groups</Link>
              </li>
              <li>
                <Link href="/regions/minnesota">Minnesota DoKADs</Link>
              </li>
              <li>
                <Link href="/share">Share DOKADS</Link>
              </li>
              <li>
                <Link href="/stories#submit">Tell us your story</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">The small print</h2>
            <ul className="stack-tight">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/guidelines">Community guidelines</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <a href="mailto:dokads@akconnection.com">dokads@akconnection.com</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="wrap wrap--wide site-footer__base">
        <IssueLabel />
        <HandwrittenNote color="paper" tiltDir={1}>
          made by the community, for the community
        </HandwrittenNote>
        <p className="site-footer__legal">
          © {new Date().getFullYear()} DOKADS. Share only what feels comfortable.
        </p>

        {/* Quiet on purpose: organisers need to find it, visitors do not need
            to wonder what it is. Sits last in the tab order. */}
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
          <span>Organisers</span>
        </Link>
      </div>
    </footer>
  )
}
