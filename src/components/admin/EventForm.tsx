'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveEvent } from '@/app/actions/admin'
import { AUDIENCE_META, EVENT_TYPES, STATUS_META } from '@/data/events'
import type { DbEvent } from '@/db/schema'

const STATUSES = Object.keys(STATUS_META)
const TYPES = Object.keys(EVENT_TYPES)
const AUDIENCES = Object.keys(AUDIENCE_META)
const VENUES = [
  'coffee shop',
  'library',
  'community center',
  'park',
  'restaurant',
  'university',
  'online',
  'other',
]
const AGES = ['all ages', 'under-18 friendly', '18+', '21+']

export function EventForm({
  event,
  regions,
}: {
  event?: DbEvent
  regions: { slug: string; name: string }[]
}) {
  const [status, setStatus] = useState(event?.status ?? 'draft')
  const [notes, setNotes] = useState<string>((event?.tentativeNotes ?? []).join('\n'))
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, start] = useTransition()
  const router = useRouter()

  const provisional = status === 'draft' || status === 'tentative'

  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const num = (k: string) => {
          const v = String(f.get(k) ?? '').trim()
          return v === '' ? null : Number(v)
        }
        setError(null)
        setSaved(false)
        start(async () => {
          const res = await saveEvent({
            id: event?.id,
            slug: String(f.get('slug') ?? ''),
            title: String(f.get('title') ?? ''),
            blurb: String(f.get('blurb') ?? ''),
            type: String(f.get('type') ?? ''),
            status,
            date: String(f.get('date') ?? ''),
            backupDate: String(f.get('backupDate') ?? ''),
            time: String(f.get('time') ?? ''),
            timezone: String(f.get('timezone') ?? ''),
            regionSlug: String(f.get('regionSlug') ?? ''),
            venueKind: String(f.get('venueKind') ?? ''),
            location: String(f.get('location') ?? ''),
            format: String(f.get('format') ?? 'online'),
            audience: String(f.get('audience') ?? ''),
            agePolicy: String(f.get('agePolicy') ?? ''),
            cost: String(f.get('cost') ?? ''),
            plusOnes: f.get('plusOnes') === 'on',
            capacity: num('capacity'),
            waitlist: f.get('waitlist') === 'on',
            minAge: num('minAge'),
            guardianConsentUnder: num('guardianConsentUnder'),
            perk: String(f.get('perk') ?? ''),
            tentativeNotes: notes.split('\n').map((s) => s.trim()).filter(Boolean),
            needsFoodInfo: f.get('needsFoodInfo') === 'on',
          })
          if (!res.ok) setError(res.error)
          else {
            setSaved(true)
            router.push('/admin/events')
            router.refresh()
          }
        })
      }}
    >
      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ev-title">Title</label>
          <input id="ev-title" name="title" type="text" required defaultValue={event?.title} />
        </div>
        <div className="adm-field">
          <label htmlFor="ev-slug">URL slug</label>
          <input
            id="ev-slug"
            name="slug"
            type="text"
            required
            defaultValue={event?.slug}
            pattern="[a-z0-9\-]+"
          />
          <span className="adm-field__help">Lowercase, numbers and hyphens.</span>
        </div>
      </div>

      <div className="adm-field">
        <label htmlFor="ev-blurb">Blurb</label>
        <textarea id="ev-blurb" name="blurb" defaultValue={event?.blurb} style={{ minHeight: '5rem' }} />
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ev-status">Status</label>
          <select id="ev-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="adm-field__help">
            {STATUS_META[status as keyof typeof STATUS_META]?.note}
            {status === 'draft' && ' — not visible on the public site at all.'}
          </span>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-type">Type</label>
          <select id="ev-type" name="type" defaultValue={event?.type ?? 'coffee meetup'}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPES[t as keyof typeof EVENT_TYPES]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ev-date">Date</label>
          <input id="ev-date" name="date" type="date" required defaultValue={event?.date} />
        </div>
        <div className="adm-field">
          <label htmlFor="ev-backup">Backup date</label>
          <input id="ev-backup" name="backupDate" type="date" defaultValue={event?.backupDate ?? ''} />
          <span className="adm-field__help">Shown publicly while the event is tentative.</span>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-time">Time</label>
          <input id="ev-time" name="time" type="text" defaultValue={event?.time} placeholder="12:00 PM" />
        </div>
        <div className="adm-field">
          <label htmlFor="ev-tz">Timezone</label>
          <input id="ev-tz" name="timezone" type="text" defaultValue={event?.timezone} placeholder="Central Time" />
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ev-region">Region</label>
          <select id="ev-region" name="regionSlug" defaultValue={event?.regionSlug ?? 'online'}>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-format">Format</label>
          <select id="ev-format" name="format" defaultValue={event?.format ?? 'online'}>
            <option value="online">online</option>
            <option value="in person">in person</option>
            <option value="hybrid">hybrid</option>
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-venue">Venue kind</label>
          <select id="ev-venue" name="venueKind" defaultValue={event?.venueKind ?? 'coffee shop'}>
            {VENUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <span className="adm-field__help">Alcohol-serving venues are not the default.</span>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-location">Location</label>
          <input id="ev-location" name="location" type="text" defaultValue={event?.location} />
          <span className="adm-field__help">Keep it vague while the venue is unconfirmed.</span>
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ev-audience">Who it is for</label>
          <select id="ev-audience" name="audience" defaultValue={event?.audience ?? 'open to all'}>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_META[a as keyof typeof AUDIENCE_META].label}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-age">Age policy</label>
          <select id="ev-age" name="agePolicy" defaultValue={event?.agePolicy ?? 'all ages'}>
            {AGES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-cost">Cost</label>
          <input id="ev-cost" name="cost" type="text" defaultValue={event?.cost ?? 'Free'} />
        </div>
        <div className="adm-field">
          <label htmlFor="ev-perk">Perk (if any)</label>
          <input id="ev-perk" name="perk" type="text" defaultValue={event?.perk ?? ''} />
          <span className="adm-field__help">
            Marked as hoped-for, not promised, while the event is tentative.
          </span>
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="ev-capacity">Capacity</label>
          <input id="ev-capacity" name="capacity" type="number" min={1} defaultValue={event?.capacity ?? ''} />
          <span className="adm-field__help">Blank means no cap. Sign-ups past this go to the waitlist.</span>
        </div>
        <div className="adm-field">
          <label htmlFor="ev-minage">Minimum age</label>
          <input id="ev-minage" name="minAge" type="number" min={1} defaultValue={event?.minAge ?? ''} />
        </div>
        <div className="adm-field">
          <label htmlFor="ev-guardian">Guardian consent under</label>
          <input
            id="ev-guardian"
            name="guardianConsentUnder"
            type="number"
            min={1}
            defaultValue={event?.guardianConsentUnder ?? ''}
          />
        </div>
      </div>

      <div className="adm-grid-2">
        <label className="adm-check">
          <input type="checkbox" name="plusOnes" defaultChecked={event?.plusOnes ?? true} />
          Plus-ones allowed
        </label>
        <label className="adm-check">
          <input type="checkbox" name="waitlist" defaultChecked={event?.waitlist ?? false} />
          Keep a waitlist when full
        </label>
        <label className="adm-check">
          <input type="checkbox" name="needsFoodInfo" defaultChecked={event?.needsFoodInfo ?? false} />
          Ask about dietary needs
        </label>
      </div>

      {provisional && (
        <div className="adm-field">
          <label htmlFor="ev-notes">What is not settled yet</label>
          <textarea
            id="ev-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={'One per line.\nThe date is not locked.\nThe venue is still being chosen.'}
          />
          <span className="adm-field__help">
            Shown publicly, verbatim, while the event is draft or tentative. Being specific about
            what might change is the whole point.
          </span>
        </div>
      )}

      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      {saved && <p className="adm-ok">Saved.</p>}

      <div className="adm-actions">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save event'}
        </button>
      </div>
    </form>
  )
}
