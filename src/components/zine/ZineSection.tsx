import type { CSSProperties, ElementType, ReactNode } from 'react'

export type Tone =
  | 'paper'
  | 'bright'
  | 'ink'
  | 'blue'
  | 'red'
  | 'yellow'
  | 'acid'
  | 'pink'
  | 'green'
  | 'lavender'
  | 'peach'
  | 'kraft'

/** The torn paper edge that sits on a section boundary. */
export function TornEdge({ side }: { side: 'top' | 'bottom' }) {
  return (
    <svg
      className={`torn-edge torn-edge--${side}`}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M0 40h1200V16c-18 4-30-6-48-3s-25 11-44 9-27-12-45-11-28 10-47 11-30-9-48-8-26 12-45 12-30-11-48-10-27 11-46 11-29-10-47-9-27 12-46 12-30-11-48-10-26 11-45 11-30-10-48-9-27 11-46 11-29-11-47-10-27 11-46 11-30-10-48-9-26 11-45 11-30-11-48-10-27 11-46 11-29-10-47-9-28 12-46 12-30-11-48-10-27 11-46 11-29-11-47-10-27 11-46 11-30-10-48-9V40Z"
      />
    </svg>
  )
}

type Props = {
  children: ReactNode
  tone?: Tone
  /** torn edge on the top, bottom, both, or neither */
  torn?: 'top' | 'bottom' | 'both' | 'none'
  grain?: boolean
  tight?: boolean
  id?: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  'aria-labelledby'?: string
}

export function ZineSection({
  children,
  tone = 'paper',
  torn = 'none',
  grain = true,
  tight = false,
  id,
  as: Tag = 'section',
  className = '',
  style,
  ...rest
}: Props) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      className={['zsec', grain ? 'grain' : '', tight ? 'zsec--tight' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {(torn === 'top' || torn === 'both') && <TornEdge side="top" />}
      {children}
      {(torn === 'bottom' || torn === 'both') && <TornEdge side="bottom" />}
    </Tag>
  )
}

/** Numbered editorial section header: 01 — KICKER ————— */
export function SectionHead({
  number,
  kicker,
  id,
}: {
  number: string
  kicker: string
  id?: string
}) {
  return (
    <div className="sec-head">
      <span className="sec-num" aria-hidden="true">
        {number}
      </span>
      <h2 className="sec-kicker" id={id}>
        <span className="visually-hidden">Section {number}. </span>
        {kicker}
      </h2>
      <span className="sec-rule" aria-hidden="true" />
    </div>
  )
}
