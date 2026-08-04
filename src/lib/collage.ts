/**
 * Deterministic abstract collage art.
 *
 * Stands in for photography until real community images exist. Every
 * composition is generated from a seed string, so a given story or event
 * always renders the same artwork — and nothing here depicts people.
 */

const PALETTES: Record<string, string[]> = {
  a: ['var(--blue)', 'var(--yellow)', 'var(--paper-bright)', 'var(--ink)'],
  b: ['var(--red)', 'var(--peach)', 'var(--paper-bright)', 'var(--ink)'],
  c: ['var(--lavender)', 'var(--yellow-acid)', 'var(--paper-bright)', 'var(--ink)'],
  d: ['var(--green)', 'var(--paper-kraft)', 'var(--paper-bright)', 'var(--ink)'],
  e: ['var(--pink)', 'var(--blue)', 'var(--paper-bright)', 'var(--ink)'],
  f: ['var(--yellow)', 'var(--ink)', 'var(--paper-shade)', 'var(--red)'],
}
const PALETTE_KEYS = Object.keys(PALETTES)

export type CollageVariant = 'cut' | 'arc' | 'grid' | 'halftone' | 'strip' | 'stack'

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, deterministic */
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type CollageShape =
  | { t: 'rect'; x: number; y: number; w: number; h: number; fill: string; rot: number }
  | { t: 'circle'; cx: number; cy: number; r: number; fill: string }
  | { t: 'path'; d: string; fill?: string; stroke?: string; sw?: number }
  | { t: 'dots'; x: number; y: number; w: number; h: number; fill: string; gap: number }

export type Collage = {
  shapes: CollageShape[]
  bg: string
}

const W = 400
const H = 300

export function makeCollage(seed: string, variant?: CollageVariant): Collage {
  const r = rng(hash(seed))
  const pal = PALETTES[PALETTE_KEYS[Math.floor(r() * PALETTE_KEYS.length)]]
  const [c1, c2, c3, ink] = pal
  const variants: CollageVariant[] = ['cut', 'arc', 'grid', 'halftone', 'strip', 'stack']
  const v = variant ?? variants[Math.floor(r() * variants.length)]
  const shapes: CollageShape[] = []
  const bg = c3
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const between = (lo: number, hi: number) => lo + r() * (hi - lo)

  switch (v) {
    case 'cut': {
      // overlapping torn rectangles, rotated slightly
      for (let i = 0; i < 4; i++) {
        shapes.push({
          t: 'rect',
          x: between(-30, 230),
          y: between(-20, 170),
          w: between(120, 240),
          h: between(80, 190),
          fill: pick([c1, c2, ink, c1]),
          rot: between(-9, 9),
        })
      }
      shapes.push({
        t: 'dots',
        x: 0,
        y: H * 0.55,
        w: W,
        h: H * 0.45,
        fill: ink,
        gap: 9,
      })
      break
    }
    case 'arc': {
      // subtle taegeuk-inspired curve pairing — two interlocking arcs
      const cx = between(150, 250)
      const cy = between(120, 180)
      const rad = between(90, 130)
      shapes.push({ t: 'circle', cx, cy, r: rad, fill: c1 })
      shapes.push({
        t: 'path',
        d: `M ${cx - rad} ${cy} A ${rad / 2} ${rad / 2} 0 0 1 ${cx} ${cy} A ${rad / 2} ${rad / 2} 0 0 0 ${cx + rad} ${cy} A ${rad} ${rad} 0 0 1 ${cx - rad} ${cy} Z`,
        fill: c2,
      })
      shapes.push({
        t: 'rect',
        x: between(-40, 40),
        y: between(-30, 40),
        w: between(90, 150),
        h: between(150, 240),
        fill: ink,
        rot: between(-6, 6),
      })
      shapes.push({ t: 'dots', x: 0, y: 0, w: W, h: H, fill: ink, gap: 12 })
      break
    }
    case 'grid': {
      // subway-signage grid with one cell knocked out in colour
      const cols = 4
      const rows = 3
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (r() > 0.62) {
            shapes.push({
              t: 'rect',
              x: (i * W) / cols,
              y: (j * H) / rows,
              w: W / cols,
              h: H / rows,
              fill: pick([c1, c2, ink]),
              rot: 0,
            })
          }
        }
      }
      for (let i = 1; i < cols; i++) {
        shapes.push({
          t: 'path',
          d: `M ${(i * W) / cols} 0 V ${H}`,
          stroke: ink,
          sw: 2,
        })
      }
      for (let j = 1; j < rows; j++) {
        shapes.push({ t: 'path', d: `M 0 ${(j * H) / rows} H ${W}`, stroke: ink, sw: 2 })
      }
      break
    }
    case 'halftone': {
      shapes.push({ t: 'rect', x: 0, y: 0, w: W, h: H, fill: c1, rot: 0 })
      shapes.push({
        t: 'circle',
        cx: between(120, 280),
        cy: between(100, 200),
        r: between(70, 110),
        fill: c2,
      })
      shapes.push({ t: 'dots', x: 0, y: 0, w: W, h: H, fill: ink, gap: 8 })
      shapes.push({
        t: 'rect',
        x: 0,
        y: between(200, 250),
        w: W,
        h: between(30, 60),
        fill: ink,
        rot: between(-3, 3),
      })
      break
    }
    case 'strip': {
      // torn horizontal strips, like a shredded photograph
      let y = between(-10, 20)
      while (y < H) {
        const h = between(22, 52)
        shapes.push({
          t: 'rect',
          x: between(-30, 10),
          y,
          w: between(380, 460),
          h,
          fill: pick([c1, c2, ink, c3]),
          rot: between(-2.5, 2.5),
        })
        y += h + between(2, 10)
      }
      break
    }
    case 'stack': {
      // layered paper cards seen from above
      for (let i = 0; i < 5; i++) {
        shapes.push({
          t: 'rect',
          x: 60 + i * between(6, 16),
          y: 30 + i * between(6, 14),
          w: between(200, 260),
          h: between(150, 200),
          fill: i === 4 ? c1 : i % 2 === 0 ? c3 : c2,
          rot: between(-7, 7),
        })
      }
      shapes.push({
        t: 'circle',
        cx: between(40, 90),
        cy: between(220, 270),
        r: between(20, 38),
        fill: ink,
      })
      break
    }
  }

  return { shapes, bg }
}

export const COLLAGE_SIZE = { W, H }
