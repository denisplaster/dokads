/**
 * Downloadable outreach assets, generated as standalone SVG so they can be
 * posted, printed, or handed to a designer. Colours are literal hex here
 * (not CSS variables) because these files leave the site.
 */

const INK = '#131110'
const PAPER = '#F6F1E6'
const BRIGHT = '#FDFAF3'
const BLUE = '#1F3CE0'
const RED = '#F0361F'
const YELLOW = '#FFD51E'

const FONT_DISPLAY = "Anton, 'Arial Narrow', Impact, sans-serif"
const FONT_BODY = "Archivo, Helvetica, Arial, sans-serif"

export type AssetKind = 'square' | 'story' | 'flyer' | 'onepager'

export const ASSETS: { kind: AssetKind; label: string; size: string; note: string }[] = [
  { kind: 'square', label: 'Square social post', size: '1080 × 1080', note: 'Instagram / Facebook feed' },
  { kind: 'story', label: 'Instagram story', size: '1080 × 1920', note: 'Stories, with room for stickers' },
  { kind: 'flyer', label: 'Printable flyer', size: 'US Letter', note: 'Pin it on a board' },
  { kind: 'onepager', label: 'One-page explainer', size: 'US Letter', note: 'Hand it out at events' },
]

function wordmark(x: number, y: number, unit: number) {
  const letters = [
    { c: 'D', fill: BRIGHT, text: INK, rot: -2.5 },
    { c: 'O', fill: RED, text: '#fff', rot: 1.5 },
    { c: 'K', fill: BRIGHT, text: INK, rot: -1 },
    { c: 'A', fill: BLUE, text: '#fff', rot: 2.5 },
    { c: 'D', fill: BRIGHT, text: INK, rot: -1.5 },
    { c: 'S', fill: YELLOW, text: INK, rot: 2 },
  ]
  const w = unit
  const h = unit * 1.16
  return letters
    .map((l, i) => {
      const lx = x + i * (w + unit * 0.06)
      return `<g transform="rotate(${l.rot} ${lx + w / 2} ${y + h / 2})">
      <rect x="${lx}" y="${y}" width="${w}" height="${h}" fill="${l.fill}" stroke="${INK}" stroke-width="${unit * 0.06}"/>
      <text x="${lx + w / 2}" y="${y + h * 0.78}" font-family="${FONT_DISPLAY}" font-size="${unit * 0.95}" fill="${l.text}" text-anchor="middle">${l.c}</text>
    </g>`
    })
    .join('')
}

function halftone(id: string, gap = 14) {
  return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">
    <circle cx="${gap / 2}" cy="${gap / 2}" r="${gap * 0.18}" fill="${INK}" opacity="0.4"/>
  </pattern>`
}

function wrapText(
  text: string,
  perLine: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > perLine) {
      lines.push(line.trim())
      line = w
    } else {
      line = `${line} ${w}`
    }
  }
  if (line.trim()) lines.push(line.trim())
  return lines
}

function textBlock(
  lines: string[],
  x: number,
  y: number,
  size: number,
  lh: number,
  fill: string,
  font = FONT_BODY,
  weight = '400',
) {
  return lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * lh}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}">${l}</text>`,
    )
    .join('')
}

const HEADLINE = 'Was your parent or grandparent adopted from Korea?'
const SUB =
  'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.'

/**
 * A downward text cursor. Every block advances it, so adding a line of copy
 * can never silently collide with whatever sits below.
 */
function flow(startY: number) {
  let y = startY
  const parts: string[] = []
  return {
    get y() {
      return y
    },
    gap(n: number) {
      y += n
      return this
    },
    lines(
      text: string,
      opts: { x: number; perLine: number; size: number; lh: number; fill: string; font?: string; weight?: string },
    ) {
      const ls = wrapText(text, opts.perLine)
      parts.push(
        textBlock(ls, opts.x, y, opts.size, opts.lh, opts.fill, opts.font ?? FONT_BODY, opts.weight ?? '400'),
      )
      y += (ls.length - 1) * opts.lh
      return this
    },
    rule(x: number, w: number, h: number, fill: string) {
      parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`)
      y += h
      return this
    },
    raw(svg: string) {
      parts.push(svg)
      return this
    },
    render() {
      return parts.join('\n  ')
    },
  }
}

export function buildAsset(kind: AssetKind): { svg: string; w: number; h: number } {
  if (kind === 'square') {
    const W = 1080
    const H = 1080
    const FOOT = 250
    const f = flow(268)
    f.lines(HEADLINE, {
      x: 60,
      perLine: 17,
      size: 92,
      lh: 94,
      fill: INK,
      font: FONT_DISPLAY,
    })
      .gap(44)
      .rule(60, W - 120, 6, RED)
      .gap(58)
      .lines(SUB, { x: 60, perLine: 46, size: 33, lh: 44, fill: INK })

    return {
      w: W,
      h: H,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${halftone('ht', 18)}</defs>
  <rect width="${W}" height="${H}" fill="${YELLOW}"/>
  <rect width="${W}" height="${H}" fill="url(#ht)"/>
  <rect x="0" y="0" width="${W}" height="150" fill="${INK}"/>
  <text x="60" y="97" font-family="${FONT_BODY}" font-weight="800" font-size="34" letter-spacing="6" fill="${PAPER}">DOKADS / ISSUE 001</text>
  ${f.render()}
  <g transform="translate(0 ${H - FOOT})">
    <rect x="0" y="0" width="${W}" height="${FOOT}" fill="${INK}"/>
    ${wordmark(60, 45, 74)}
    <text x="60" y="215" font-family="${FONT_BODY}" font-weight="800" font-size="36" fill="${YELLOW}">dokads.com/am-i-a-dokad</text>
  </g>
</svg>`,
    }
  }

  if (kind === 'story') {
    const W = 1080
    const H = 1920
    const head = wrapText(HEADLINE, 14)
    return {
      w: W,
      h: H,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${halftone('ht2', 20)}</defs>
  <rect width="${W}" height="${H}" fill="${BLUE}"/>
  <rect width="${W}" height="${H}" fill="url(#ht2)"/>
  <rect x="0" y="380" width="${W}" height="${H - 900}" fill="${PAPER}"/>
  <text x="70" y="240" font-family="${FONT_BODY}" font-weight="800" font-size="36" letter-spacing="8" fill="${YELLOW}">NEVER HEARD THE WORD?</text>
  <text x="70" y="300" font-family="${FONT_BODY}" font-weight="800" font-size="36" letter-spacing="8" fill="#fff">YOU’RE NOT ALONE.</text>
  ${head.map((l, i) => `<text x="70" y="${540 + i * 104}" font-family="${FONT_DISPLAY}" font-size="102" fill="${INK}">${l}</text>`).join('')}
  <rect x="70" y="${560 + head.length * 104}" width="${W - 140}" height="7" fill="${RED}"/>
  ${textBlock(wrapText(SUB, 40), 70, 640 + head.length * 104, 38, 52, INK)}
  <g transform="translate(70 ${H - 460})">
    <rect x="-14" y="-40" width="${W - 112}" height="150" fill="${YELLOW}" stroke="${INK}" stroke-width="6"/>
    <text x="30" y="45" font-family="${FONT_DISPLAY}" font-size="60" fill="${INK}">AM I A DoKAD?</text>
    <text x="30" y="92" font-family="${FONT_BODY}" font-weight="700" font-size="30" fill="${INK}">Find out in 30 seconds →</text>
  </g>
  ${wordmark(70, H - 250, 78)}
  <text x="70" y="${H - 90}" font-family="${FONT_BODY}" font-weight="800" font-size="38" fill="#fff">dokads.com</text>
</svg>`,
    }
  }

  if (kind === 'flyer') {
    const W = 816
    const H = 1056
    const DEF_H = 176
    const f = flow(272)
    f.lines(HEADLINE, { x: 56, perLine: 16, size: 58, lh: 62, fill: INK, font: FONT_DISPLAY })
      .gap(28)
      .rule(56, W - 112, 5, RED)
      .gap(42)
      .lines(SUB, { x: 56, perLine: 52, size: 23, lh: 33, fill: INK })
      .gap(52)

    // the definition block sits wherever the copy above ended
    const defY = f.y
    f.raw(`<rect x="56" y="${defY}" width="${W - 112}" height="${DEF_H}" fill="${YELLOW}" stroke="${INK}" stroke-width="4"/>
  <rect x="56" y="${defY}" width="${W - 112}" height="${DEF_H}" fill="url(#ht3)"/>
  <text x="86" y="${defY + 52}" font-family="${FONT_DISPLAY}" font-size="38" fill="${INK}">WHAT IS A DoKAD?</text>
  ${textBlock(
    wrapText(
      'A descendant of a Korean adoptee — the child, grandchild, or great-grandchild of someone adopted from Korea. There is no test to pass.',
      56,
    ),
    86,
    defY + 92,
    22,
    30,
    INK,
  )}`)

    return {
      w: W,
      h: H,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${halftone('ht3', 12)}</defs>
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${W}" height="18" fill="${RED}"/>
  <rect x="0" y="18" width="${W}" height="10" fill="${BLUE}"/>
  ${wordmark(56, 70, 52)}
  <text x="56" y="205" font-family="${FONT_BODY}" font-style="italic" font-size="26" fill="${BLUE}">Descendants of Korean Adoptees</text>
  ${f.render()}
  <rect x="56" y="${H - 196}" width="150" height="150" fill="${BRIGHT}" stroke="${INK}" stroke-width="4"/>
  <text x="131" y="${H - 128}" font-family="${FONT_BODY}" font-weight="800" font-size="19" fill="${INK}" text-anchor="middle">QR CODE</text>
  <text x="131" y="${H - 104}" font-family="${FONT_BODY}" font-size="15" fill="${INK}" text-anchor="middle">drop it here</text>
  <text x="234" y="${H - 140}" font-family="${FONT_DISPLAY}" font-size="42" fill="${INK}">dokads.com</text>
  <text x="234" y="${H - 100}" font-family="${FONT_BODY}" font-weight="700" font-size="24" fill="${BLUE}">/am-i-a-dokad</text>
</svg>`,
    }
  }

  // one-pager
  const W = 816
  const H = 1056
  const GENS = [
    ['Korean birth family', 'in Korea'],
    ['Korean adoptee', 'your parent or grandparent'],
    ['Child of a Korean adoptee', 'a DoKAD'],
    ['Grandchild of a Korean adoptee', 'also a DoKAD'],
    ['Future generations', 'still DoKADs'],
  ]
  return {
    w: W,
    h: H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BRIGHT}"/>
  <rect x="0" y="0" width="${W}" height="120" fill="${INK}"/>
  ${wordmark(46, 26, 44)}
  <text x="${W - 46}" y="74" font-family="${FONT_BODY}" font-weight="800" font-size="22" letter-spacing="4" fill="${YELLOW}" text-anchor="end">AM I A DoKAD?</text>
  <text x="46" y="200" font-family="${FONT_DISPLAY}" font-size="54" fill="${INK}">A DoKAD is a descendant</text>
  <text x="46" y="256" font-family="${FONT_DISPLAY}" font-size="54" fill="${INK}">of a Korean adoptee.</text>
  ${textBlock(
    wrapText(
      'If your parent or grandparent was adopted from Korea, that is you. It does not depend on speaking Korean, having been to Korea, how you look, or knowing anything about your family history.',
      70,
    ),
    46,
    310,
    21,
    30,
    INK,
  )}
  ${GENS.map((g, i) => {
    const y = 402 + i * 96
    const fill = i === 2 || i === 3 ? YELLOW : i === 1 ? BLUE : BRIGHT
    const tc = i === 1 ? '#fff' : INK
    return `<g>
      <rect x="46" y="${y}" width="${W - 92}" height="70" fill="${fill}" stroke="${INK}" stroke-width="3"/>
      <text x="70" y="${y + 32}" font-family="${FONT_DISPLAY}" font-size="28" fill="${tc}">${g[0]}</text>
      <text x="70" y="${y + 57}" font-family="${FONT_BODY}" font-size="18" fill="${tc}" opacity="0.85">${g[1]}</text>
      ${i < GENS.length - 1 ? `<path d="M ${W / 2} ${y + 70} l 0 26" stroke="${INK}" stroke-width="4" fill="none"/>` : ''}
    </g>`
  }).join('')}
  <rect x="46" y="${H - 150}" width="${W - 92}" height="100" fill="${RED}"/>
  <text x="70" y="${H - 100}" font-family="${FONT_DISPLAY}" font-size="34" fill="#fff">There is no test you need to pass.</text>
  <text x="70" y="${H - 68}" font-family="${FONT_BODY}" font-weight="700" font-size="22" fill="${YELLOW}">dokads.com/am-i-a-dokad</text>
</svg>`,
  }
}

export function downloadSvg(kind: AssetKind) {
  const { svg } = buildAsset(kind)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dokads-${kind}.svg`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
