import { Link } from 'react-router-dom'
import { HandwrittenNote, IssueLabel, Sticker, TornEdge } from '../zine'
import { Wordmark } from '../zine/Wordmark'

export function Footer() {
  return (
    <footer className="site-footer zsec grain" data-tone="ink">
      <TornEdge side="top" />
      <div className="wrap wrap--wide site-footer__inner">
        <div className="site-footer__brand">
          <Wordmark size="lg" withNote />
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
                <Link to="/start">Start here</Link>
              </li>
              <li>
                <Link to="/am-i-a-dokad">Am I a DoKAD?</Link>
              </li>
              <li>
                <Link to="/learn">Learn</Link>
              </li>
              <li>
                <Link to="/stories">Stories</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/resources">Resources</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Take part</h2>
            <ul className="stack-tight">
              <li>
                <Link to="/join">Join the community</Link>
              </li>
              <li>
                <Link to="/regions">Local groups</Link>
              </li>
              <li>
                <Link to="/regions/minnesota">Minnesota DoKADs</Link>
              </li>
              <li>
                <Link to="/share">Share DOKADS</Link>
              </li>
              <li>
                <Link to="/stories#submit">Tell us your story</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">The small print</h2>
            <ul className="stack-tight">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/guidelines">Community guidelines</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
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
      </div>
    </footer>
  )
}
