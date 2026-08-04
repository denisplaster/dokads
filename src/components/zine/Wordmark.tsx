import type { CSSProperties } from 'react'

/**
 * DOKADS wordmark — cut-paper letter blocks with a deliberate
 * registration wobble. The wobble is fixed per letter, never random,
 * so the logo is identical on every render.
 */
const LETTERS: { c: string; tone: string; rot: number; y: number }[] = [
  { c: 'D', tone: 'ink', rot: -2.5, y: 0 },
  { c: 'O', tone: 'red', rot: 1.5, y: -3 },
  { c: 'K', tone: 'ink', rot: -1, y: 2 },
  { c: 'A', tone: 'blue', rot: 2.5, y: -2 },
  { c: 'D', tone: 'ink', rot: -1.5, y: 1 },
  { c: 'S', tone: 'yellow', rot: 2, y: -1 },
]

export function Wordmark({
  size = 'md',
  withNote = false,
  mono = false,
  className = '',
  style,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** show the handwritten “Descendants of Korean Adoptees” note underneath */
  withNote?: boolean
  /** single-colour version for tight or dark placements */
  mono?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={`wordmark wordmark--${size} ${mono ? 'wordmark--mono' : ''} ${className}`} style={style}>
      <span className="wordmark__row">
        <span className="visually-hidden">DOKADS</span>
        {LETTERS.map((l, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`wordmark__ltr wordmark__ltr--${l.tone}`}
            style={
              {
                '--ltr-rot': `${l.rot}deg`,
                '--ltr-y': `${l.y}px`,
              } as CSSProperties
            }
          >
            {l.c}
          </span>
        ))}
      </span>
      {withNote && (
        <span className="wordmark__note" aria-hidden="true">
          Descendants of Korean Adoptees
        </span>
      )}
    </span>
  )
}

/** Square single-letter mark for avatars and the favicon. */
export function WordmarkGlyph({ size = 40 }: { size?: number }) {
  return (
    <span className="wordmark-glyph" style={{ width: size, height: size, fontSize: size * 0.62 }}>
      D
    </span>
  )
}
