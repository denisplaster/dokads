/**
 * Editable page text — the field vocabulary.
 *
 * Every piece of public wording that is not an event, story, region or
 * resource is declared once, in src/content/pages, as a field with a label
 * for the editor and a default (the text the site shipped with). Views read
 * the resolved values; the admin renders a form from the same declarations.
 *
 * An editor's change is stored as an override (table page_copy). Anything
 * without an override shows the default, so code and database never have to
 * be kept in step by hand, and "reset to default" is just deleting the row.
 *
 * Inline formatting understood everywhere text is rendered with <Rich>:
 *   **bold**   *italic*   ==highlighted==   [link text](/path or https://…)
 * and a line break in a headline field becomes a line break on the page.
 */

type Base = {
  label: string
  /** shown under the label in the admin */
  help?: string
}

/** One line of text. Line breaks are not allowed. */
export type LineField = Base & { kind: 'line'; default: string }
/** Text that may contain line breaks (headlines that wrap on purpose, addresses). */
export type TextField = Base & { kind: 'text'; default: string }
/** Paragraphs, separated by a blank line in the editor. */
export type ParasField = Base & { kind: 'paras'; default: readonly string[] }
/** A list, one item per line in the editor. */
export type ListField = Base & { kind: 'list'; default: readonly string[] }
/** One of a fixed set of values. */
export type SelectField = Base & {
  kind: 'select'
  options: readonly { value: string; label: string }[]
  default: string
}

export type SimpleField = LineField | TextField | ParasField | ListField | SelectField

export type SimpleValue<F> = F extends { kind: 'line' | 'text' | 'select' }
  ? string
  : F extends { kind: 'paras' | 'list' }
    ? string[]
    : never

export type ItemValue<S extends Record<string, SimpleField>> = {
  [K in keyof S]: SimpleValue<S[K]>
}

/** A repeating group: cards, steps, list entries with more than one part. */
export type ItemsField<S extends Record<string, SimpleField> = Record<string, SimpleField>> =
  Base & {
    kind: 'items'
    fields: S
    default: readonly ItemValue<S>[]
    /**
     * The design has a slot per item (each card has its own colour, link or
     * position), so items can be edited but not added or removed.
     */
    fixed?: boolean
    /** the sub-field used to title each item in the admin */
    itemTitle?: keyof S & string
    /** what one item is called in the admin ("card", "question") */
    noun?: string
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Field = SimpleField | ItemsField<any>

export type FieldValue<F> = F extends ItemsField<infer S> ? ItemValue<S>[] : SimpleValue<F>

export type Section = {
  title: string
  help?: string
  fields: Record<string, Field>
}

export type PageDef = {
  /** stable id; the database key — never rename once live */
  id: string
  /** what the editor sees in the admin */
  title: string
  /** where it appears on the public site; null for text shared by many pages */
  path: string | null
  help?: string
  sections: Record<string, Section>
}

export type PageValues<P extends PageDef> = {
  [S in keyof P['sections']]: {
    [K in keyof P['sections'][S]['fields']]: FieldValue<P['sections'][S]['fields'][K]>
  }
}

/* ---------- declaration helpers ---------- */

type Opts = { help?: string }

export const line = (label: string, def: string, o: Opts = {}): LineField => ({
  kind: 'line',
  label,
  default: def,
  ...o,
})
export const text = (label: string, def: string, o: Opts = {}): TextField => ({
  kind: 'text',
  label,
  default: def,
  ...o,
})
export const paras = (label: string, def: readonly string[], o: Opts = {}): ParasField => ({
  kind: 'paras',
  label,
  default: def,
  ...o,
})
export const list = (label: string, def: readonly string[], o: Opts = {}): ListField => ({
  kind: 'list',
  label,
  default: def,
  ...o,
})
export const select = (
  label: string,
  options: readonly { value: string; label: string }[],
  def: string,
  o: Opts = {},
): SelectField => ({ kind: 'select', label, options, default: def, ...o })

export function items<const S extends Record<string, SimpleField>>(
  label: string,
  fields: S,
  def: readonly ItemValue<S>[],
  o: Opts & { fixed?: boolean; itemTitle?: keyof S & string; noun?: string } = {},
): ItemsField<S> {
  return { kind: 'items', label, fields, default: def, ...o }
}

export function definePage<const P extends PageDef>(p: P): P {
  return p
}

/* ---------- validation + resolution ---------- */

const LIMITS = { line: 600, text: 4000, para: 6000, listItem: 600, entries: 80 }

const oneLine = (s: string) => s.replace(/\r/g, '').replace(/\s*\n+\s*/g, ' ')

function str(v: unknown, max: number): string | undefined {
  return typeof v === 'string' && v.length <= max ? v : undefined
}

function strArr(v: unknown, max: number): string[] | undefined {
  if (!Array.isArray(v) || v.length > LIMITS.entries) return undefined
  const out: string[] = []
  for (const x of v) {
    if (typeof x !== 'string' || x.length > max) return undefined
    const t = x.trim()
    if (t) out.push(t)
  }
  return out
}

/**
 * Checks a stored or submitted value against its field and normalises it.
 * Returns undefined when it does not fit — callers fall back to the default
 * (when reading) or reject the save (when writing). This is what keeps an
 * old override from breaking a page after a field changes shape in code.
 */
export function coerce(field: Field, value: unknown): unknown {
  switch (field.kind) {
    case 'line': {
      const s = str(value, LIMITS.line)
      return s === undefined ? undefined : oneLine(s).trim()
    }
    case 'text': {
      const s = str(value, LIMITS.text)
      return s === undefined ? undefined : s.replace(/\r/g, '').trim()
    }
    case 'paras':
      return strArr(value, LIMITS.para)
    case 'list':
      return strArr(value, LIMITS.listItem)
    case 'select':
      return typeof value === 'string' && field.options.some((o) => o.value === value)
        ? value
        : undefined
    case 'items': {
      if (!Array.isArray(value) || value.length > LIMITS.entries) return undefined
      if (field.fixed && value.length !== field.default.length) return undefined
      const out: Record<string, unknown>[] = []
      for (const item of value) {
        if (!item || typeof item !== 'object') return undefined
        const row: Record<string, unknown> = {}
        for (const [k, sub] of Object.entries(field.fields as Record<string, SimpleField>)) {
          const v = coerce(sub, (item as Record<string, unknown>)[k])
          if (v === undefined) return undefined
          row[k] = v
        }
        out.push(row)
      }
      return out
    }
  }
}

export type Overrides = Record<string, unknown>

/** The values a page renders with: defaults, with valid overrides on top. */
export function resolvePage<P extends PageDef>(def: P, overrides: Overrides = {}): PageValues<P> {
  const out: Record<string, Record<string, unknown>> = {}
  for (const [sKey, section] of Object.entries(def.sections)) {
    const vals: Record<string, unknown> = {}
    for (const [fKey, field] of Object.entries(section.fields)) {
      const key = `${sKey}.${fKey}`
      const v = key in overrides ? coerce(field, overrides[key]) : undefined
      vals[fKey] = v === undefined ? field.default : v
    }
    out[sKey] = vals
  }
  return out as PageValues<P>
}

/** Every field of a page with its storage key, in declaration order. */
export function fieldsOf(def: PageDef): { key: string; section: string; field: Field }[] {
  const out: { key: string; section: string; field: Field }[] = []
  for (const [sKey, section] of Object.entries(def.sections)) {
    for (const [fKey, field] of Object.entries(section.fields)) {
      out.push({ key: `${sKey}.${fKey}`, section: sKey, field })
    }
  }
  return out
}

/** Structural equality for JSON-shaped values. */
export function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
