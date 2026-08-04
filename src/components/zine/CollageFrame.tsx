'use client'

import { useId, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { COLLAGE_SIZE, makeCollage } from '../../lib/collage'
import type { CollageVariant } from '../../lib/collage'

const { W, H } = COLLAGE_SIZE

/**
 * A framed piece of generated abstract art. Decorative by default — pass
 * `alt` only when the artwork carries meaning of its own.
 */
export function CollageFrame({
  seed,
  variant,
  ratio = '4 / 3',
  caption,
  alt,
  children,
  className = '',
  style,
}: {
  seed: string
  variant?: CollageVariant
  ratio?: string
  caption?: string
  alt?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const clipId = useId().replace(/:/g, '')
  const dotId = `d${clipId}`
  const collage = useMemo(() => makeCollage(seed, variant), [seed, variant])

  return (
    <div
      className={`collage-frame ${className}`}
      style={{ ['--ratio' as string]: ratio, ['--frame-bg' as string]: collage.bg, ...style }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role={alt ? 'img' : 'presentation'}
        aria-label={alt}
        aria-hidden={alt ? undefined : true}
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
          {collage.shapes
            .filter((s) => s.t === 'dots')
            .map((s, i) => (
              <pattern
                key={i}
                id={`${dotId}-${i}`}
                width={s.gap}
                height={s.gap}
                patternUnits="userSpaceOnUse"
              >
                <circle cx={s.gap / 2} cy={s.gap / 2} r={s.gap * 0.21} fill={s.fill} />
              </pattern>
            ))}
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width={W} height={H} fill={collage.bg} />
          {collage.shapes.map((s, i) => {
            if (s.t === 'rect') {
              return (
                <rect
                  key={i}
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  fill={s.fill}
                  transform={`rotate(${s.rot} ${s.x + s.w / 2} ${s.y + s.h / 2})`}
                />
              )
            }
            if (s.t === 'circle') {
              return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />
            }
            if (s.t === 'dots') {
              return (
                <rect
                  key={i}
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  fill={`url(#${dotId}-${i})`}
                  opacity="0.5"
                />
              )
            }
            return (
              <path
                key={i}
                d={s.d}
                fill={s.fill ?? 'none'}
                stroke={s.stroke ?? 'none'}
                strokeWidth={s.sw ?? 0}
              />
            )
          })}
        </g>
      </svg>
      {children}
      {caption && <span className="collage-frame__caption">{caption}</span>}
    </div>
  )
}
