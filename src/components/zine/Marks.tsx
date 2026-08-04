'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { rot } from './Paper'

/** Marker-pen note. Short text only — never body copy. */
export function HandwrittenNote({
  children,
  color = 'blue',
  tiltDir = -1,
  className = '',
  style,
}: {
  children: ReactNode
  color?: 'blue' | 'red' | 'ink' | 'paper'
  tiltDir?: 1 | -1
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={`hand-note ${color !== 'blue' ? `hand-note--${color}` : ''} ${className}`}
      style={{ ...rot('lean', tiltDir), ...style }}
    >
      {children}
    </span>
  )
}

/** Hand-drawn underline that draws itself in when scrolled into view. */
export function ScribbleUnderline({
  color = 'red',
  variant = 1,
  className = '',
}: {
  color?: 'red' | 'blue' | 'yellow' | 'ink'
  variant?: 1 | 2 | 3
  className?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const paths = {
    1: 'M4 22C70 8 190 6 296 14',
    2: 'M4 20c58-12 176-14 292-4M12 28c70-8 180-9 280-3',
    3: 'M4 24c48-16 132-18 200-8 34 5 62 3 92-6',
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`scribble scribble--draw ${drawn ? 'is-drawn' : ''} ${className}`}
      style={{ ['--scribble-color' as string]: `var(--${color})`, height: '0.42em' }}
    >
      <path d={paths[variant]} />
    </svg>
  )
}

/** Hand-drawn arrow. Points right by default; rotate with the `turn` prop. */
export function HandArrow({
  turn = 0,
  color = 'ink',
  size = 88,
  nudge = false,
  className = '',
  style,
}: {
  turn?: number
  color?: 'ink' | 'red' | 'blue' | 'yellow' | 'paper'
  size?: number
  nudge?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 120 60"
      width={size}
      aria-hidden="true"
      focusable="false"
      className={`arrow-hand ${nudge ? 'arrow-nudge' : ''} ${className}`}
      style={{
        ['--arrow-color' as string]: `var(--${color})`,
        transform: `rotate(${turn}deg)`,
        ...style,
      }}
    >
      <path d="M6 34c26-16 56-22 92-20" />
      <path d="M78 4c8 4 15 7 22 10-7 5-13 11-19 19" />
    </svg>
  )
}

/** Editorial pull quote. */
export function PullQuote({
  children,
  cite,
  body = false,
  mark = true,
  className = '',
  style,
}: {
  children: ReactNode
  cite?: string
  body?: boolean
  mark?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <figure className={className} style={style}>
      <blockquote className={`pullquote ${body ? 'pullquote--body' : ''}`}>
        {mark && (
          <span className="pullquote__mark" aria-hidden="true">
            “
          </span>
        )}
        {children}
      </blockquote>
      {cite && <figcaption className="pullquote__cite">{cite}</figcaption>}
    </figure>
  )
}

/** Scrolling editorial statement band. */
export function Marquee({
  items,
  tone = 'ink',
  speed = 34,
}: {
  items: string[]
  tone?: string
  speed?: number
}) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee" data-tone={tone} role="presentation">
      <div className="marquee__track" style={{ ['--speed' as string]: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span className="marquee__item" key={i} aria-hidden={i >= items.length}>
            {item}
            <span className="marquee__sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
