'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { EditorialHeadline, PaperCard, TapeStrip } from '../zine'
import { AUDIENCE_META } from '../../data/events'
import { AGE_CHOICES, CONNECTION_CHOICES, MINOR_AGES, MINOR_NOTICE } from '../../data/joinForm'
import { GUIDELINES_CHECKBOX } from '../../data/community'
import { submitRegistration } from '../../app/actions/public'

export function RegistrationForm({
  eventSlug,
  audience,
  needsFood,
  guardianConsentUnder,
  open,
}: {
  eventSlug: string
  audience: keyof typeof AUDIENCE_META
  needsFood?: boolean
  guardianConsentUnder?: number
  open: boolean
}) {
  const [age, setAge] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const isMinor = MINOR_AGES.has(age)

  if (done) {
    return (
      <PaperCard className="reg-done" tilt="nudge" tiltDir={-1} shadow="slab" data-tone="acid" style={{ background: 'var(--surface)' }}>
        <TapeStrip position="top-center" variant="clear" width={130} />
        <EditorialHeadline size={2}>
          {open ? 'You’re on the list.' : 'We’ll let you know.'}
        </EditorialHeadline>
        <p style={{ marginTop: 'var(--s-4)' }}>
          {open
            ? 'You are on the list. If anything changes about the venue or timing, we will tell you before you travel.'
            : 'This one is not confirmed yet. As soon as the date and venue are locked in, you will hear from us — and you can change your mind at any point.'}
        </p>
        <div style={{ marginTop: 'var(--s-5)', display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <Link href="/events" className="btn btn--ghost">
            Other events
          </Link>
          <Link href="/join" className="btn btn--red">
            Join DOKADS properly
          </Link>
        </div>
      </PaperCard>
    )
  }

  return (
    <form
      className="reg-form"
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        setError(null)
        startTransition(async () => {
          const res = await submitRegistration({
            eventSlug,
            firstName: String(form.get('first') ?? ''),
            lastName: String(form.get('last') ?? ''),
            email: String(form.get('email') ?? ''),
            ageRange: age,
            city: String(form.get('city') ?? ''),
            connection: String(form.get('connection') ?? ''),
            accessibility: String(form.get('access') ?? ''),
            dietary: String(form.get('diet') ?? ''),
            wantsUpdates: form.get('updates') === 'on',
            agreedGuidelines: agreed,
          })
          if (res.ok) setDone(true)
          else setError(res.error)
        })
      }}
      aria-labelledby={`reg-${eventSlug}`}
    >
      <h3 id={`reg-${eventSlug}`} className="reg-form__head">
        {open ? 'Save me a spot' : 'Tell me when this is confirmed'}
      </h3>

      {audience === 'dokads only' && (
        <p className="reg-form__notice">{AUDIENCE_META['dokads only'].detail}</p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="reg-first">First name</label>
          <input id="reg-first" name="first" type="text" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="reg-last">
            Last name or initial <span className="field__opt">optional</span>
          </label>
          <input id="reg-last" name="last" type="text" autoComplete="family-name" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="reg-email">Email</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" required />
        <p className="field__help">Used for this event. Nothing else unless you tick the box below.</p>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="reg-age">
            Age range <span className="field__opt">optional</span>
          </label>
          <select id="reg-age" name="age" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Prefer not to say</option>
            {AGE_CHOICES.filter((c) => c.value !== 'no-answer').map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="field__help">We never ask for an exact date of birth.</p>
        </div>
        <div className="field">
          <label htmlFor="reg-city">
            City or region <span className="field__opt">optional</span>
          </label>
          <input id="reg-city" name="city" type="text" autoComplete="address-level2" />
        </div>
      </div>

      {isMinor && (
        <p className="reg-form__minor" role="status">
          {MINOR_NOTICE}
          {guardianConsentUnder && (
            <>
              {' '}
              For this event, anyone under {guardianConsentUnder} needs a parent or guardian to
              confirm by email first — we will send you what they need.
            </>
          )}
        </p>
      )}

      <div className="field">
        <label htmlFor="reg-connection">
          Your connection to the DoKAD community <span className="field__opt">optional</span>
        </label>
        <select id="reg-connection" name="connection" defaultValue="">
          <option value="">Prefer not to say</option>
          {CONNECTION_CHOICES.filter((c) => c.value !== 'no-answer').map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="reg-access">
          Accessibility or accommodation request <span className="field__opt">optional</span>
        </label>
        <textarea id="reg-access" name="access" rows={2} />
        <p className="field__help">
          Step-free access, a quieter corner, captions, anything at all. Ask and we will sort it.
        </p>
      </div>

      {needsFood && (
        <div className="field">
          <label htmlFor="reg-diet">
            Dietary considerations <span className="field__opt">optional</span>
          </label>
          <input id="reg-diet" name="diet" type="text" />
        </div>
      )}

      <div className="check">
        <input id="reg-updates" name="updates" type="checkbox" />
        <label htmlFor="reg-updates">
          Send me updates about DOKADS events. <span className="field__opt">optional</span>
        </label>
      </div>

      <div className="check">
        <input
          id="reg-guidelines"
          name="guidelines"
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label htmlFor="reg-guidelines">
          {GUIDELINES_CHECKBOX} <Link href="/guidelines">Read them</Link>
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--red btn--lg btn--block" disabled={pending}>
        {pending ? 'Sending…' : open ? 'Register' : 'Keep me posted'}
      </button>

      <p className="reg-form__foot">
        We store what you enter here so we can run the event. Reply to any email from us and we
        will delete it — no form, no reason needed.
      </p>
    </form>
  )
}
