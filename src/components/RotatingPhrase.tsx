'use client'

import { useEffect, useState } from 'react'

/**
 * The one moving element in the hero. Split out so the homepage itself can
 * stay a server component and render its stories and events on the server.
 */
export function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0)
  const count = phrases.length

  useEffect(() => {
    if (count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % count), 4200)
    return () => clearInterval(t)
  }, [count])

  if (!count) return null

  return (
    <p className="hero__rotating" aria-live="polite">
      <span key={i} className="hero__rotating-text">
        {phrases[i % count]}
      </span>
    </p>
  )
}
