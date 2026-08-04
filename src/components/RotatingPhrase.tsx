'use client'

import { useEffect, useState } from 'react'

const ROTATING = [
  'Identity is inherited, discovered, and created.',
  'Our parents’ stories are part of ours — but not all of ours.',
  'There is no single way to be a DoKAD.',
  'A new generation is joining the conversation.',
]

/**
 * The one moving element in the hero. Split out so the homepage itself can
 * stay a server component and render its stories and events on the server.
 */
export function RotatingPhrase() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % ROTATING.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <p className="hero__rotating" aria-live="polite">
      <span key={i} className="hero__rotating-text">
        {ROTATING[i]}
      </span>
    </p>
  )
}
