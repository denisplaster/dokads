import type { CSSProperties, ReactNode } from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { rot } from './Paper'

export type StickerColor =
  | 'yellow'
  | 'red'
  | 'blue'
  | 'ink'
  | 'pink'
  | 'green'
  | 'lavender'
  | 'peach'
  | 'acid'
  | 'paper'

type Base = {
  children: ReactNode
  color?: StickerColor
  square?: boolean
  marker?: boolean
  flat?: boolean
  large?: boolean
  tiltDir?: 1 | -1
  className?: string
  style?: CSSProperties
}

function classes({ color = 'yellow', square, marker, flat, large, className = '' }: Base) {
  return [
    'sticker',
    color !== 'yellow' ? `sticker--${color}` : '',
    square ? 'sticker--square' : '',
    marker ? 'sticker--marker' : '',
    flat ? 'sticker--flat' : '',
    large ? 'sticker--lg' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

/** A sticker label. Renders as a span, a link, or a button. */
export function Sticker(props: Base & { to?: Route; href?: string; onClick?: () => void }) {
  const { children, tiltDir = -1, style, to, href, onClick } = props
  const style_ = { ...rot('tilt', tiltDir), ...style }
  const cn = classes(props)

  if (to) {
    return (
      <Link href={to} className={cn} style={style_}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cn} style={style_} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  if (onClick) {
    return (
      <button type="button" className={cn} style={style_} onClick={onClick}>
        {children}
      </button>
    )
  }
  return (
    <span className={cn} style={style_}>
      {children}
    </span>
  )
}

/** Category chip used across stories and resources. */
export function CategorySticker({
  kind,
  label,
  className = '',
}: {
  kind: string
  label: string
  className?: string
}) {
  return <span className={`cat-sticker cat--${kind} ${className}`}>{label}</span>
}

/** DOKADS / ISSUE 001 */
export function IssueLabel({
  issue = '001',
  prefix = 'DOKADS',
  className = '',
}: {
  issue?: string
  prefix?: string
  className?: string
}) {
  return (
    <span className={`issue-label ${className}`}>
      <span className="issue-label__dot" aria-hidden="true" />
      {prefix} / Issue {issue}
    </span>
  )
}

/** Rubber-stamped place name. */
export function LocationStamp({
  children,
  color = 'red',
  round = false,
  tiltDir = -1,
  className = '',
}: {
  children: ReactNode
  color?: 'red' | 'blue' | 'ink' | 'green'
  round?: boolean
  tiltDir?: 1 | -1
  className?: string
}) {
  return (
    <span
      className={`stamp ${color !== 'red' ? `stamp--${color}` : ''} ${round ? 'stamp--round' : ''} ${className}`}
      style={rot('wild', tiltDir)}
    >
      {children}
    </span>
  )
}
