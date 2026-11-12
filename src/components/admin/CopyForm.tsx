'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { savePageCopy } from '@/app/actions/cms'
import type { Field, PageDef, SimpleField } from '@/content/fields'

/**
 * The editor for one page's text, generated from its field declarations in
 * src/content/pages. Text areas hold raw strings while you type; they are
 * turned into paragraphs / list items only when saving, so blank lines can be
 * typed freely.
 */

type ItemRaw = Record<string, string>
type Raw = string | ItemRaw[]

function toRaw(field: Field, value: unknown): Raw {
  switch (field.kind) {
    case 'paras':
      return ((value as string[]) ?? []).join('\n\n')
    case 'list':
      return ((value as string[]) ?? []).join('\n')
    case 'items':
      return ((value as Record<string, unknown>[]) ?? []).map((item) =>
        Object.fromEntries(
          Object.entries(field.fields as Record<string, SimpleField>).map(([k, sub]) => [
            k,
            toRaw(sub, item[k]) as string,
          ]),
        ),
      )
    default:
      return String(value ?? '')
  }
}

function fromRaw(field: Field, raw: Raw): unknown {
  switch (field.kind) {
    case 'paras':
      return (raw as string)
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    case 'list':
      return (raw as string)
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
    case 'items':
      return (raw as ItemRaw[]).map((item) =>
        Object.fromEntries(
          Object.entries(field.fields as Record<string, SimpleField>).map(([k, sub]) => [
            k,
            fromRaw(sub, item[k] ?? ''),
          ]),
        ),
      )
    case 'line':
      return (raw as string).replace(/\s*\n+\s*/g, ' ').trim()
    default:
      return (raw as string).trim()
  }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

function rowsFor(text: string, min: number) {
  return Math.max(min, Math.min(18, Math.ceil(text.length / 90) + text.split('\n').length))
}

function SimpleInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string
  field: SimpleField
  value: string
  onChange: (v: string) => void
}) {
  switch (field.kind) {
    case 'line':
      return <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    case 'select':
      return (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
    default:
      return (
        <textarea
          id={id}
          value={value}
          rows={rowsFor(value, field.kind === 'text' ? 2 : 4)}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}

const KIND_HELP: Partial<Record<Field['kind'], string>> = {
  paras: 'Leave a blank line between paragraphs.',
  list: 'One per line.',
  text: 'A line break here becomes a line break on the page.',
}

function FieldEditor({
  fieldKey,
  field,
  raw,
  setRaw,
}: {
  fieldKey: string
  field: Field
  raw: Raw
  setRaw: (r: Raw) => void
}) {
  const id = `f-${fieldKey.replace(/\W/g, '-')}`
  const isDefault = same(fromRaw(field, raw), field.default)
  const help = [field.help, KIND_HELP[field.kind]].filter(Boolean).join(' ')

  const head = (
    <div className="adm-copy__head">
      <label htmlFor={field.kind === 'items' ? undefined : id}>{field.label}</label>
      {!isDefault && <span className="adm-chip">edited</span>}
      {!isDefault && (
        <button
          type="button"
          className="adm-link"
          onClick={() => setRaw(toRaw(field, field.default))}
        >
          Reset to original
        </button>
      )}
    </div>
  )

  if (field.kind !== 'items') {
    return (
      <div className="adm-field adm-copy">
        {head}
        <SimpleInput
          id={id}
          field={field}
          value={raw as string}
          onChange={(v) => setRaw(v)}
        />
        {help && <span className="adm-field__help">{help}</span>}
      </div>
    )
  }

  const items = raw as ItemRaw[]
  const subs = Object.entries(field.fields as Record<string, SimpleField>)
  const noun = field.noun ?? 'item'
  const update = (i: number, k: string, v: string) =>
    setRaw(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)))
  const move = (i: number, d: -1 | 1) => {
    const next = [...items]
    const [it] = next.splice(i, 1)
    next.splice(i + d, 0, it)
    setRaw(next)
  }

  return (
    <div className="adm-field adm-copy">
      {head}
      {help && <span className="adm-field__help">{help}</span>}
      <ol className="adm-items">
        {items.map((item, i) => (
          <li key={i} className="adm-item">
            <div className="adm-item__head">
              <span className="adm-item__title">
                {(field.itemTitle && item[field.itemTitle]) || `${noun} ${i + 1}`}
              </span>
              {!field.fixed && (
                <span className="adm-actions">
                  <button type="button" className="adm-link" disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    className="adm-link"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓ Down
                  </button>
                  <button
                    type="button"
                    className="adm-link adm-link--danger"
                    onClick={() => setRaw(items.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                </span>
              )}
            </div>
            {subs.map(([k, sub]) => {
              const subId = `${id}-${i}-${k}`
              const subHelp = [sub.help, KIND_HELP[sub.kind]].filter(Boolean).join(' ')
              return (
                <div className="adm-field" key={k}>
                  <label htmlFor={subId}>{sub.label}</label>
                  <SimpleInput id={subId} field={sub} value={item[k] ?? ''} onChange={(v) => update(i, k, v)} />
                  {subHelp && <span className="adm-field__help">{subHelp}</span>}
                </div>
              )
            })}
          </li>
        ))}
      </ol>
      {!field.fixed && (
        <button
          type="button"
          className="adm-btn adm-btn--ghost"
          onClick={() =>
            setRaw([
              ...items,
              Object.fromEntries(subs.map(([k, sub]) => [k, toRaw(sub, sub.default) as string])),
            ])
          }
        >
          Add {noun}
        </button>
      )}
    </div>
  )
}

export function CopyForm({
  pageId,
  def,
  values,
}: {
  pageId: string
  def: PageDef
  values: Record<string, unknown>
  edited: string[]
}) {
  const fields = useMemo(() => {
    const out: { key: string; section: string; field: Field }[] = []
    for (const [s, sec] of Object.entries(def.sections)) {
      for (const [f, field] of Object.entries(sec.fields)) out.push({ key: `${s}.${f}`, section: s, field })
    }
    return out
  }, [def])

  const initial = useMemo(
    () => Object.fromEntries(fields.map(({ key, field }) => [key, toRaw(field, values[key])])),
    [fields, values],
  )
  const [raw, setRawAll] = useState<Record<string, Raw>>(initial)
  const [saved, setSaved] = useState(initial)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  const dirty = !same(raw, saved)
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const setRaw = (key: string) => (r: Raw) => {
    setMessage(null)
    setRawAll((prev) => ({ ...prev, [key]: r }))
  }

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        const out = Object.fromEntries(fields.map(({ key, field }) => [key, fromRaw(field, raw[key])]))
        start(async () => {
          const res = await savePageCopy(pageId, out)
          if (!res.ok) {
            setMessage({ ok: false, text: res.error })
            return
          }
          setSaved(raw)
          setMessage({ ok: true, text: 'Saved. It goes live on the public site when you publish.' })
          router.refresh()
        })
      }}
    >
      <p className="adm-note">
        <strong>Formatting:</strong> <code>**bold**</code> · <code>*italic*</code> ·{' '}
        <code>==highlighted==</code> · <code>[link text](https://example.com)</code> or{' '}
        <code>[link text](/events)</code> for a page on this site.
      </p>

      {Object.entries(def.sections).map(([sKey, section]) => (
        <section key={sKey} className="adm-card">
          <h2>{section.title}</h2>
          {section.help && <p className="adm-field__help">{section.help}</p>}
          {fields
            .filter((f) => f.section === sKey)
            .map(({ key, field }) => (
              <FieldEditor key={key} fieldKey={key} field={field} raw={raw[key]} setRaw={setRaw(key)} />
            ))}
        </section>
      ))}

      <div className="adm-savebar">
        {message && (
          <span className={message.ok ? 'adm-ok' : 'adm-error'} role="status">
            {message.text}
          </span>
        )}
        {dirty && !message && <span className="adm-savebar__dirty">Unsaved changes</span>}
        <button type="submit" className="adm-btn" disabled={pending || !dirty}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
