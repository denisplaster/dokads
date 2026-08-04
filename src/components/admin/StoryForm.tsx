'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveStory } from '@/app/actions/admin'
import { STORY_KINDS } from '@/data/stories'
import type { DbStory } from '@/db/schema'

const KINDS = Object.keys(STORY_KINDS)
const BYLINE_STYLES = ['full name', 'first name', 'pseudonym', 'anonymous'] as const
const ART = ['cut', 'arc', 'grid', 'halftone', 'strip', 'stack']

export function StoryForm({ story }: { story?: DbStory }) {
  const [status, setStatus] = useState(story?.status ?? 'draft')
  const [placeholder, setPlaceholder] = useState(story?.isPlaceholder ?? false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        setError(null)
        start(async () => {
          const res = await saveStory({
            slug: String(f.get('slug') ?? ''),
            originalSlug: story?.slug,
            title: String(f.get('title') ?? ''),
            dek: String(f.get('dek') ?? ''),
            kind: String(f.get('kind') ?? 'essay'),
            byline: String(f.get('byline') ?? ''),
            bylineStyle: String(f.get('bylineStyle') ?? 'anonymous'),
            location: String(f.get('location') ?? ''),
            issue: String(f.get('issue') ?? '001'),
            readingTime: String(f.get('readingTime') ?? '3'),
            pullquote: String(f.get('pullquote') ?? ''),
            art: String(f.get('art') ?? ''),
            featured: f.get('featured') === 'on',
            bodyText: String(f.get('bodyText') ?? ''),
            status,
            isPlaceholder: placeholder,
          })
          if (!res.ok) setError(res.error)
          else {
            router.push('/admin/stories')
            router.refresh()
          }
        })
      }}
    >
      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="st-title">Title</label>
          <input id="st-title" name="title" type="text" required defaultValue={story?.title} />
        </div>
        <div className="adm-field">
          <label htmlFor="st-slug">URL slug</label>
          <input id="st-slug" name="slug" type="text" required defaultValue={story?.slug} pattern="[a-z0-9\-]+" />
        </div>
      </div>

      <div className="adm-field">
        <label htmlFor="st-dek">Standfirst</label>
        <textarea id="st-dek" name="dek" defaultValue={story?.dek} style={{ minHeight: '4rem' }} />
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="st-kind">Format</label>
          <select id="st-kind" name="kind" defaultValue={story?.kind ?? 'essay'}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {STORY_KINDS[k as keyof typeof STORY_KINDS].label}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="st-byline">Byline</label>
          <input id="st-byline" name="byline" type="text" defaultValue={story?.byline} />
        </div>
        <div className="adm-field">
          <label htmlFor="st-bylinestyle">How they chose to be credited</label>
          <select id="st-bylinestyle" name="bylineStyle" defaultValue={story?.bylineStyle ?? 'anonymous'}>
            {BYLINE_STYLES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <span className="adm-field__help">
            The contributor&rsquo;s choice. They can change it later, or withdraw the piece.
          </span>
        </div>
        <div className="adm-field">
          <label htmlFor="st-location">Location</label>
          <input id="st-location" name="location" type="text" defaultValue={story?.location ?? ''} />
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="st-issue">Issue</label>
          <input id="st-issue" name="issue" type="text" defaultValue={story?.issue ?? '001'} />
        </div>
        <div className="adm-field">
          <label htmlFor="st-time">Reading time (min)</label>
          <input id="st-time" name="readingTime" type="number" min={1} defaultValue={story?.readingTime ?? 3} />
        </div>
        <div className="adm-field">
          <label htmlFor="st-art">Artwork style</label>
          <select id="st-art" name="art" defaultValue={story?.art ?? ''}>
            <option value="">auto</option>
            {ART.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <span className="adm-field__help">Generated abstract art — never stock photos of people.</span>
        </div>
        <div className="adm-field">
          <label htmlFor="st-status">Status</label>
          <select id="st-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
      </div>

      <div className="adm-field">
        <label htmlFor="st-pullquote">Pull quote</label>
        <input id="st-pullquote" name="pullquote" type="text" defaultValue={story?.pullquote ?? ''} />
      </div>

      <div className="adm-field">
        <label htmlFor="st-body">Body</label>
        <textarea
          id="st-body"
          name="bodyText"
          defaultValue={(story?.body ?? []).join('\n\n')}
          style={{ minHeight: '18rem' }}
        />
        <span className="adm-field__help">
          Blank line between paragraphs. Start a line with &ldquo;&gt; &rdquo; to render it as a
          pull quote.
        </span>
      </div>

      <div className="adm-grid-2">
        <label className="adm-check">
          <input type="checkbox" name="featured" defaultChecked={story?.featured ?? false} />
          Featured on the homepage
        </label>
        <label className="adm-check">
          <input
            type="checkbox"
            checked={placeholder}
            onChange={(e) => setPlaceholder(e.target.checked)}
          />
          This is placeholder layout copy, not a real contribution
        </label>
      </div>

      {placeholder && (
        <p className="adm-note">
          Placeholder pieces render with a visible flag on the public page saying they are layout
          copy and not anyone&rsquo;s real account. Untick this only for genuine submissions.
        </p>
      )}

      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}

      <div className="adm-actions">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save story'}
        </button>
      </div>
    </form>
  )
}
