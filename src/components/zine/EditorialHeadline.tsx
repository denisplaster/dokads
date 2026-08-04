import type { CSSProperties, ElementType, ReactNode } from 'react'

type Size = 'mega' | 'display' | 1 | 2 | 3

/**
 * The one headline component. Size is a token, never a raw font-size.
 * Inline emphasis is done with the `.knock`, `.outline` and `.highlight`
 * classes on spans inside `children`.
 */
export function EditorialHeadline({
  children,
  size = 1,
  as,
  id,
  className = '',
  style,
}: {
  children: ReactNode
  size?: Size
  as?: ElementType
  id?: string
  className?: string
  style?: CSSProperties
}) {
  const Tag: ElementType = as ?? (size === 'mega' || size === 'display' || size === 1 ? 'h1' : 'h2')
  return (
    <Tag id={id} className={`ed-head ed-head--${size} ${className}`} style={style}>
      {children}
    </Tag>
  )
}
