import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EditorialHeadline,
  HandArrow,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  ScribbleUnderline,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { DokadDefinition } from '../components/DokadDefinition'
import {
  AGE_CHOICES,
  AGGREGATE_LINE,
  CONNECTION_CHOICES,
  DESCRIPTION_CHOICES,
  INTEREST_CHOICES,
  MINOR_AGES,
  MINOR_NOTICE,
  PRIVACY_LINE,
  TIMING_CHOICES,
  VENUE_CHOICES,
} from '../data/joinForm'
import type { Choice } from '../data/joinForm'
import { GUIDELINES_CHECKBOX } from '../data/community'
import { regions } from '../data/regions'

const STEPS = [
  { n: 1, title: 'So, what brings you here?', tone: 'yellow' },
  { n: 2, title: 'What are you curious about?', tone: 'pink' },
  { n: 3, title: 'When and where suits you?', tone: 'acid' },
  { n: 4, title: 'How should we keep in touch?', tone: 'blue' },
] as const

const ENCOURAGEMENT = [
  'Nice. Two more like that.',
  'This is the useful bit — it decides what we actually run.',
  'Almost done. Last stretch.',
]

/** Big tap-friendly answer cards with sticker-style selected states. */
function ChoiceGrid({
  choices,
  value,
  onChange,
  multi = false,
  name,
  columns = 2,
}: {
  choices: Choice[]
  value: string[]
  onChange: (next: string[]) => void
  multi?: boolean
  name: string
  columns?: number
}) {
  const toggle = (v: string) => {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
    } else {
      onChange(value.includes(v) ? [] : [v])
    }
  }

  return (
    <div
      className="choices"
      style={{ ['--cols' as string]: columns }}
      role="group"
      aria-label={name}
    >
      {choices.map((c, i) => {
        const on = value.includes(c.value)
        return (
          <label
            key={c.value}
            className={`choice ${on ? 'is-on' : ''}`}
            style={rot('hair', i % 2 === 0 ? 1 : -1)}
          >
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={name}
              checked={on}
              onChange={() => toggle(c.value)}
            />
            <span className="choice__tick" aria-hidden="true">
              ✓
            </span>
            <span className="choice__label">{c.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export function Join() {
  const [step, setStep] = useState(1)
  const [connection, setConnection] = useState<string[]>([])
  const [description, setDescription] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [timing, setTiming] = useState<string[]>([])
  const [venues, setVenues] = useState<string[]>([])
  const [region, setRegion] = useState('')
  const [age, setAge] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)

  const isMinor = MINOR_AGES.has(age)
  const pct = Math.round(((step - 1) / STEPS.length) * 100)
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  /* ---------------- confirmation ---------------- */
  if (done) {
    return (
      <ZineSection tone="acid" torn="bottom" className="join-done">
        <div className="wrap join-done__inner">
          <div className="join-done__stickers" aria-hidden="true">
            <Sticker color="red" large>
              ✦
            </Sticker>
            <Sticker color="blue" large tiltDir={1}>
              ✦
            </Sticker>
            <Sticker color="yellow" large>
              ✦
            </Sticker>
          </div>
          <EditorialHeadline size="display">
            You’re in.{' '}
            <br />
            Welcome to <span className="knock">DOKADS</span>.
          </EditorialHeadline>
          <ScribbleUnderline color="red" variant={2} />
          <p className="lead" style={{ marginTop: 'var(--s-5)' }}>
            Thanks for joining a growing community of people exploring what it means to be a
            descendant of a Korean adoptee. There is no one way to be a DoKAD, and you do not
            need to have everything figured out before taking part.
          </p>

          <PaperCard className="join-done__next" tilt="hair" shadow="slab">
            <TapeStrip position="top-center" variant="clear" width={140} />
            <h2 className="eyebrow">While you’re here</h2>
            <ul className="join-done__list">
              <li>
                <Link to="/events">See what’s coming up</Link> — the first Minnesota meetup is
                penciled in, and the online sessions are open to everyone.
              </li>
              <li>
                <Link to="/stories">Read the stories</Link> — or send us one of your own.
              </li>
              <li>
                <Link to="/share">Share DOKADS</Link> — most people find this through someone
                else in their family.
              </li>
            </ul>
          </PaperCard>

          <p className="join-done__foot">
            This is a demonstration form and nothing was sent anywhere. Once it is live, you
            will be able to change or delete everything you gave us by replying to any email.
          </p>
        </div>
      </ZineSection>
    )
  }

  /* ---------------- the questionnaire ---------------- */
  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="join-head" grain>
        <div className="wrap wrap--wide join-head__inner">
          <div>
            <IssueLabel />
            <EditorialHeadline size="display" className="join-head__title">
              Join{' '}
              <br />
              DOKADS.
            </EditorialHeadline>
            <p className="lead">
              A few quick questions — nothing too personal. It takes about a minute and it is
              genuinely how we decide what to run.
            </p>
            <p className="join-head__privacy">{PRIVACY_LINE}</p>
            <p className="join-head__note">
              <HandArrow turn={14} size={60} color="blue" />
              <HandwrittenNote>skip anything you’d rather not answer</HandwrittenNote>
            </p>
          </div>
          <DokadDefinition showCta={false} />
        </div>
      </ZineSection>

      <ZineSection tone="bright" className="join-form-sec">
        <div className="wrap">
          {/* progress */}
          <div className="progress">
            <div className="progress__bar">
              <div
                className="progress__fill"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-label={`Step ${step} of ${STEPS.length}`}
              />
            </div>
            <ol className="progress__steps">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className={s.n === step ? 'is-on' : s.n < step ? 'is-done' : ''}
                  aria-current={s.n === step ? 'step' : undefined}
                >
                  <span className="progress__num">{String(s.n).padStart(2, '0')}</span>
                  <span className="progress__label">{s.title}</span>
                </li>
              ))}
            </ol>
            {step > 1 && (
              <p className="progress__encourage">
                <HandwrittenNote color="red" tiltDir={1}>
                  {ENCOURAGEMENT[step - 2]}
                </HandwrittenNote>
              </p>
            )}
          </div>

          <form
            className="join-form"
            data-tone={STEPS[step - 1].tone}
            onSubmit={(e) => {
              e.preventDefault()
              if (step < STEPS.length) next()
              else setDone(true)
            }}
          >
            {/* ---------- STEP 1 ---------- */}
            {step === 1 && (
              <fieldset className="join-step">
                <legend className="join-step__legend">
                  <span className="join-step__num">01</span>
                  So, what brings you here?
                </legend>

                <h3 className="join-step__q">What connects you to Korean adoption?</h3>
                <p className="join-step__help">
                  Plain language first — you do not have to use the word DoKAD anywhere on this
                  form.
                </p>
                <ChoiceGrid
                  name="connection"
                  choices={CONNECTION_CHOICES}
                  value={connection}
                  onChange={setConnection}
                />

                <h3 className="join-step__q join-step__q--2">
                  Which description feels right for you?
                </h3>
                <p className="join-step__help">
                  Entirely optional, and you can change your mind later. Nobody is required to
                  pick “DoKAD”.
                </p>
                <ChoiceGrid
                  name="description"
                  choices={DESCRIPTION_CHOICES}
                  value={description}
                  onChange={setDescription}
                />
              </fieldset>
            )}

            {/* ---------- STEP 2 ---------- */}
            {step === 2 && (
              <fieldset className="join-step">
                <legend className="join-step__legend">
                  <span className="join-step__num">02</span>
                  What are you curious about?
                </legend>
                <h3 className="join-step__q">What would you like DOKADS to offer?</h3>
                <p className="join-step__help">Pick as many as you like. {AGGREGATE_LINE}</p>
                <ChoiceGrid
                  name="interests"
                  choices={INTEREST_CHOICES}
                  value={interests}
                  onChange={setInterests}
                  multi
                  columns={3}
                />
              </fieldset>
            )}

            {/* ---------- STEP 3 ---------- */}
            {step === 3 && (
              <fieldset className="join-step">
                <legend className="join-step__legend">
                  <span className="join-step__num">03</span>
                  When and where suits you?
                </legend>

                <h3 className="join-step__q">When are you most likely to attend?</h3>
                <ChoiceGrid
                  name="timing"
                  choices={TIMING_CHOICES}
                  value={timing}
                  onChange={setTiming}
                  multi
                  columns={3}
                />

                <h3 className="join-step__q join-step__q--2">
                  What kinds of venues feel comfortable?
                </h3>
                <p className="join-step__help">
                  Worth saying: alcohol-serving venues are not our default, and plenty of
                  people here are under 21.
                </p>
                <ChoiceGrid
                  name="venues"
                  choices={VENUE_CHOICES}
                  value={venues}
                  onChange={setVenues}
                  multi
                  columns={3}
                />
              </fieldset>
            )}

            {/* ---------- STEP 4 ---------- */}
            {step === 4 && (
              <fieldset className="join-step">
                <legend className="join-step__legend">
                  <span className="join-step__num">04</span>
                  How should we keep in touch?
                </legend>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="join-name">First name or what you go by</label>
                    <input id="join-name" type="text" autoComplete="given-name" required />
                  </div>
                  <div className="field">
                    <label htmlFor="join-email">Email</label>
                    <input id="join-email" type="email" autoComplete="email" required />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="join-age">
                      Age range <span className="field__opt">optional</span>
                    </label>
                    <select
                      id="join-age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    >
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
                    <label htmlFor="join-region">
                      Where are you? <span className="field__opt">optional</span>
                    </label>
                    <select
                      id="join-region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="">Choose a region</option>
                      {regions.map((r) => (
                        <option key={r.slug} value={r.slug}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <p className="field__help">
                      Used to tell you about things near you, and to work out where a chapter
                      could start.
                    </p>
                  </div>
                </div>

                {isMinor && (
                  <p className="join-step__minor" role="status">
                    {MINOR_NOTICE}
                  </p>
                )}

                <div className="check">
                  <input id="join-updates" type="checkbox" defaultChecked />
                  <label htmlFor="join-updates">
                    Email me about DOKADS events and new stories.
                  </label>
                </div>
                <div className="check">
                  <input id="join-local" type="checkbox" />
                  <label htmlFor="join-local">
                    Email me about things happening in my region specifically.
                  </label>
                </div>
                <div className="check">
                  <input id="join-volunteer" type="checkbox" />
                  <label htmlFor="join-volunteer">
                    I might want to help organise something.
                  </label>
                </div>
                <div className="check">
                  <input
                    id="join-guidelines"
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label htmlFor="join-guidelines">
                    {GUIDELINES_CHECKBOX} <Link to="/guidelines">Read them</Link>
                  </label>
                </div>

                <p className="join-step__privacy">{PRIVACY_LINE}</p>
              </fieldset>
            )}

            {/* nav */}
            <div className="join-nav">
              {step > 1 ? (
                <button type="button" className="btn btn--ghost" onClick={back}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <div className="join-nav__right">
                {step < STEPS.length && (
                  <button type="button" className="join-nav__skip" onClick={next}>
                    Skip this question
                  </button>
                )}
                <button type="submit" className="btn btn--red btn--lg">
                  {step < STEPS.length ? 'Next →' : 'Join DOKADS'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </ZineSection>
    </>
  )
}
