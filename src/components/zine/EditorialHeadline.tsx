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
  sentence = false,
  as,
  id,
  className = '',
  style,
}: {
  children: ReactNode
  size?: Size
  /**
   * Set in sentence case instead of all caps. Use for any headline longer than
   * a few words — a full sentence in caps at display size reads as shouting,
   * which is the wrong register for most of what this site talks about.
   */
  sentence?: boolean
  as?: ElementType
  id?: string
  className?: string
  style?: CSSProperties
}) {
  const Tag: ElementType = as ?? (size === 'mega' || size === 'display' || size === 1 ? 'h1' : 'h2')
  return (
    <Tag
      id={id}
      className={`ed-head ed-head--${size} ${sentence ? 'ed-head--sentence' : ''} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}
