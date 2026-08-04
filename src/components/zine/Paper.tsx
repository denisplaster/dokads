import type { CSSProperties, ElementType, ReactNode } from 'react'

type RotKey = 'hair' | 'nudge' | 'tilt' | 'lean' | 'wild'
const ROT: Record<RotKey, string> = {
  hair: 'var(--rot-hair)',
  nudge: 'var(--rot-nudge)',
  tilt: 'var(--rot-tilt)',
  lean: 'var(--rot-lean)',
  wild: 'var(--rot-wild)',
}

/** Turn a rotation token + direction into a CSS custom property value. */
export function rot(key: RotKey, dir: 1 | -1 = 1): CSSProperties {
  return { ['--rot' as string]: dir === 1 ? ROT[key] : `calc(${ROT[key]} * -1)` }
}

type PaperCardProps = {
  children: ReactNode
  /** rotation token — never pass a raw angle */
  tilt?: RotKey
  tiltDir?: 1 | -1
  shadow?: 'card' | 'lift' | 'slab' | 'none'
  torn?: boolean
  soft?: boolean
  ruled?: boolean
  pickup?: boolean
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export function PaperCard({
  children,
  tilt,
  tiltDir = 1,
  shadow = 'card',
  torn = false,
  soft = false,
  ruled = false,
  pickup = false,
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}: PaperCardProps) {
  const shadowClass =
    shadow === 'none'
      ? 'paper-card--flat'
      : shadow === 'lift'
        ? 'paper-card--lift'
        : shadow === 'slab'
          ? 'paper-card--slab'
          : ''
  return (
    <Tag
      className={[
        'paper-card',
        shadowClass,
        torn ? 'paper-card--torn' : '',
        soft ? 'paper-card--soft' : '',
        ruled ? 'ruled' : '',
        pickup ? 'paper-card--pickup' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...(tilt ? rot(tilt, tiltDir) : null), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * TornPaperPanel — a colour field with a ragged top and bottom, meant to be
 * layered over another surface (not used as a full-bleed section).
 */
export function TornPaperPanel({
  children,
  tone = 'yellow',
  tilt,
  tiltDir = 1,
  className = '',
  style,
}: {
  children: ReactNode
  tone?: string
  tilt?: RotKey
  tiltDir?: 1 | -1
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      data-tone={tone}
      className={`torn-panel grain ${className}`}
      style={{ ...(tilt ? rot(tilt, tiltDir) : null), ...style }}
    >
      <div className="torn-panel__inner">{children}</div>
    </div>
  )
}

export function TapeStrip({
  position = 'top-center',
  variant = 'kraft',
  width,
  className = '',
}: {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right'
  variant?: 'kraft' | 'blue' | 'pink' | 'clear' | 'yellow'
  width?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`tape tape--${position} ${variant !== 'yellow' ? `tape--${variant}` : ''} ${className}`}
      style={width ? ({ ['--tape-w' as string]: `${width}px` } as CSSProperties) : undefined}
    />
  )
}

export function Staple({ style }: { style?: CSSProperties }) {
  return <span aria-hidden="true" className="staple" style={style} />
}
