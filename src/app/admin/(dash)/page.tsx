import Link from 'next/link'
import { getAdminCounts, getPlanningTallies } from '@/db/queries'
import { INTEREST_CHOICES, TIMING_CHOICES, VENUE_CHOICES } from '@/data/joinForm'
import { emailConfigured } from '@/lib/email/send'
import type { Tally } from '@/db/queries'

export const dynamic = 'force-dynamic'

/** Turn stored choice values back into the labels people actually saw. */
function labeller(choices: { value: string; label: string }[]) {
  const map = new Map(choices.map((c) => [c.value, c.label]))
  return (v: string) => map.get(v) ?? v
}

function TallyBlock({
  title,
  rows,
  label,
  note,
}: {
  title: string
  rows: Tally[]
  label: (v: string) => string
  note?: string
}) {
  const max = Math.max(1, ...rows.map((r) => r.n))
  return (
    <div className="adm-card">
      <h2>{title}</h2>
      {note && <p className="adm-field__help" style={{ marginBottom: 'var(--s-3)' }}>{note}</p>}
      {rows.length === 0 ? (
        <p className="adm-empty">Nothing yet — this fills in as people join.</p>
      ) : (
        <div className="adm-tally">
          {rows.map((r) => (
            <div className="adm-tally__row" key={r.value}>
              <span>{label(r.value)}</span>
              <span className="adm-tally__bar">
                <span
                  className="adm-tally__fill"
                  style={{ width: `${Math.round((r.n / max) * 100)}%` }}
                />
              </span>
              <span className="adm-tally__n">{r.n}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function AdminHome() {
  const [counts, tallies] = await Promise.all([getAdminCounts(), getPlanningTallies()])
  const mailOn = emailConfigured()
  const notifyOn = Boolean(process.env.ADMIN_NOTIFY_EMAIL)

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Overview</h1>
          <p>
            Counts and aggregates, not lists of people. Individual answers are one click away
            where you need them, but this page is deliberately the anonymous view.
          </p>
        </div>
        <div className="adm-actions">
          <Link href="/admin/events" className="adm-btn">
            Manage events
          </Link>
          <Link href="/admin/inbox" className="adm-btn adm-btn--ghost">
            Inbox{counts.newSubmissions > 0 ? ` (${counts.newSubmissions})` : ''}
          </Link>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat">
          <div className="adm-stat__n">{counts.members}</div>
          <div className="adm-stat__label">Members</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat__n">{counts.registrations}</div>
          <div className="adm-stat__label">Event registrations</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat__n">{counts.events}</div>
          <div className="adm-stat__label">Events (all statuses)</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat__n">{counts.newSubmissions}</div>
          <div className="adm-stat__label">Unread submissions</div>
        </div>
      </div>

      {!mailOn && (
        <p className="adm-note">
          <strong>Email is not configured, so nobody is being notified.</strong> Registrations
          and joins are still recorded and everything below is accurate — but the people signing
          up receive no confirmation, and admin password reset will not work. Set{' '}
          <code>RESEND_API_KEY</code> and <code>EMAIL_FROM</code> to turn it on.
        </p>
      )}

      {mailOn && !notifyOn && (
        <p className="adm-note">
          <strong>People get confirmations, but you do not get notified.</strong> Set{' '}
          <code>ADMIN_NOTIFY_EMAIL</code> if you want an email when someone registers, joins, or
          sends something to the inbox.
        </p>
      )}

      {tallies.totals.minors > 0 && (
        <p className="adm-note">
          <strong>
            {tallies.totals.minors} member{tallies.totals.minors === 1 ? ' is' : 's are'} under 18.
          </strong>{' '}
          They are excluded from CSV exports unless you explicitly tick the box, and must not be
          added to public directories, research lists, or unrestricted groups.
        </p>
      )}

      <TallyBlock
        title="What people want"
        rows={tallies.interests}
        label={labeller(INTEREST_CHOICES)}
        note="Straight from the join form. This is what should decide the programme."
      />
      <TallyBlock
        title="When they can come"
        rows={tallies.timing}
        label={labeller(TIMING_CHOICES)}
        note="Early survey work pointed at weekends and evenings — check whether that still holds."
      />
      <TallyBlock
        title="Where they are comfortable"
        rows={tallies.venues}
        label={labeller(VENUE_CHOICES)}
        note="Alcohol-serving venues are an option, not the default."
      />
      <TallyBlock title="By region" rows={tallies.byRegion} label={(v) => v} />
      <TallyBlock
        title="By age range"
        rows={tallies.byAge}
        label={(v) => v}
        note="Brackets only. Exact dates of birth are never collected."
      />

      <div className="adm-card">
        <h2>Volunteers</h2>
        <p>
          <strong>{tallies.totals.volunteers}</strong> member
          {tallies.totals.volunteers === 1 ? ' has' : 's have'} said they might help organise
          something. See <Link href="/admin/members">Members</Link> to find them.
        </p>
      </div>
    </>
  )
}
