'use client'

import { useEffect, useRef, useState } from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wordmark } from '../zine/Wordmark'
import { HandwrittenNote, Sticker, IssueLabel } from '../zine'

/** Primary nav — kept to five so it still scans at a glance. */
const LINKS: { to: Route; label: string; num: string; note?: string }[] = [
  { to: '/start', label: 'Start here', num: '01', note: 'new? this one' },
  { to: '/am-i-a-dokad', label: 'Am I a DoKAD?', num: '02', note: 'takes 30 seconds' },
  { to: '/stories', label: 'Stories', num: '03', note: 'the good stuff' },
  { to: '/events', label: 'Events', num: '04' },
  { to: '/resources', label: 'Resources', num: '05', note: 'reading list' },
]

/** Secondary — full-screen menu only. */
const MORE: { to: Route; label: string }[] = [
  { to: '/regions', label: 'Local groups' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
  { to: '/guidelines', label: 'Guidelines' },
  { to: '/share', label: 'Share DOKADS' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const closeRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // close the menu on navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // lock scroll + trap escape while the full-screen menu is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className="site-nav">
        <div className="site-nav__inner wrap wrap--wide">
          <Link href="/" className="site-nav__brand" aria-label="DOKADS — home">
            <Wordmark size="sm" />
          </Link>

          <nav className="site-nav__links" aria-label="Main">
            {LINKS.map((l) => {
              const active = pathname === l.to || pathname.startsWith(`${l.to}/`)
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  aria-current={active ? 'page' : undefined}
                  className={`site-nav__link ${active ? 'is-active' : ''}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          <div className="site-nav__actions">
            <Sticker to="/join" color="red" large className="site-nav__join">
              Join DOKADS
            </Sticker>
            <button
              ref={toggleRef}
              type="button"
              className="site-nav__burger"
              aria-expanded={open}
              aria-controls="zine-menu"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span className="visually-hidden">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* full-screen contents-page menu */}
      <div
        id="zine-menu"
        className={`zine-menu ${open ? 'is-open' : ''}`}
        data-tone="ink"
        hidden={!open}
      >
        <div className="zine-menu__head wrap">
          <IssueLabel />
          <button
            ref={closeRef}
            type="button"
            className="zine-menu__close"
            onClick={() => setOpen(false)}
          >
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <nav className="zine-menu__body wrap" aria-label="Site contents">
          <p className="zine-menu__label">Contents</p>
          <ul className="zine-menu__list">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link href={l.to} className="zine-menu__link">
                  <span className="zine-menu__num" aria-hidden="true">
                    {l.num}
                  </span>
                  <span>{l.label}</span>
                </Link>
                {l.note && (
                  <HandwrittenNote color="paper" className="zine-menu__note">
                    {l.note}
                  </HandwrittenNote>
                )}
              </li>
            ))}
            <li>
              <Link href="/join" className="zine-menu__link zine-menu__link--accent">
                <span className="zine-menu__num" aria-hidden="true">
                  06
                </span>
                <span>Join DOKADS</span>
              </Link>
            </li>
          </ul>

          <p className="zine-menu__label zine-menu__label--more">Also inside</p>
          <ul className="zine-menu__more">
            {MORE.map((m) => (
              <li key={m.to}>
                <Link href={m.to}>{m.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="zine-menu__foot wrap">
          <p className="zine-menu__tag">
            A space for descendants of Korean adoptees. Still figuring it out? Same.
          </p>
          <Sticker to="/join" color="yellow" large>
            Get the newsletter
          </Sticker>
        </div>
      </div>
    </>
  )
}
