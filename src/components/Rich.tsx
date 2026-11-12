import type { Route } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

/**
 * Renders editor-written text with the small set of inline marks the admin
 * documents:
 *
 *   **bold**   *italic*   ==highlighted==   [link text](/path or https://…)
 *
 * and a line break as a line break. Marks nest one way: a link inside bold
 * works (**see [this](/x)**). Everything else is plain text — React escapes
 * it, so nothing an editor types can inject markup.
 */
const TOKEN = /(\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*\n]+\*\*|==[^=\n]+==|\*[^*\n]+\*|\n)/g
const LINK = /^\[([^\]\n]+)\]\(([^)\s]+)\)$/

function isSafeHref(href: string) {
  return /^(\/|#|https?:\/\/|mailto:|tel:)/.test(href)
}

export function Rich({ text }: { text: string }) {
  if (!text) return null
  const parts = text.split(TOKEN)
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null
        if (p === '\n') {
          // the space keeps words apart for screen readers and text extraction
          return (
            <Fragment key={i}>
              {' '}
              <br />
            </Fragment>
          )
        }
        const link = LINK.exec(p)
        if (link) {
          const [, label, href] = link
          if (!isSafeHref(href)) return <Fragment key={i}>{label}</Fragment>
          if (href.startsWith('/') || href.startsWith('#')) {
            return (
              <Link key={i} href={href as Route}>
                {label}
              </Link>
            )
          }
          const external = href.startsWith('http')
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {label}
            </a>
          )
        }
        if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
          return (
            <strong key={i}>
              <Rich text={p.slice(2, -2)} />
            </strong>
          )
        }
        if (p.startsWith('==') && p.endsWith('==') && p.length > 4) {
          return (
            <span key={i} className="highlight">
              <Rich text={p.slice(2, -2)} />
            </span>
          )
        }
        if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
          return (
            <em key={i}>
              <Rich text={p.slice(1, -1)} />
            </em>
          )
        }
        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

/** Plain text with the marks stripped — for metadata, alt text and aria labels. */
export function plain(text: string): string {
  return text
    .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/==([^=\n]+)==/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/\s*\n\s*/g, ' ')
}
