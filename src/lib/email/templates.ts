import { AUDIENCE_META, STATUS_META, formatEventDate } from '@/data/events'
import type { DbEvent } from '@/db/schema'
import type { EventAudience, EventStatus } from '@/data/events'
import { emailReplyTo } from './send'

/**
 * Server-only. Not enforced via the `server-only` package because CLI scripts
 * legitimately reach this module through the auth config, and that package
 * throws outside a React Server Component context. The runtime check below
 * catches the mistake this actually guards against. (No secret could leak
 * regardless: Next only inlines NEXT_PUBLIC_* into client bundles.)
 */
if (typeof window !== 'undefined') {
  throw new Error('src/lib/email is server-only and must not be imported from a client component.')
}


/* Email clients are not browsers: tables, inline styles, web-safe faces only.
   The zine lives on the site; here we just need it to arrive and be legible. */

const INK = '#131110'
const PAPER = '#F6F1E6'
const BRIGHT = '#FDFAF3'
const RED = '#DC2812'
const YELLOW = '#FFD51E'
const BLUE = '#1F3CE0'
const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif"

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function shell(title: string, bodyHtml: string, site: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${SANS};color:${INK};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRIGHT};border:2px solid ${INK};">
  <tr><td style="background:${INK};padding:16px 24px;">
    <span style="font-family:${SANS};font-weight:bold;font-size:20px;letter-spacing:2px;color:${BRIGHT};">D</span><span style="font-family:${SANS};font-weight:bold;font-size:20px;letter-spacing:2px;color:${RED};">O</span><span style="font-family:${SANS};font-weight:bold;font-size:20px;letter-spacing:2px;color:${BRIGHT};">K</span><span style="font-family:${SANS};font-weight:bold;font-size:20px;letter-spacing:2px;color:${BLUE};">A</span><span style="font-family:${SANS};font-weight:bold;font-size:20px;letter-spacing:2px;color:${BRIGHT};">D</span><span style="font-family:${SANS};font-weight:bold;font-size:20px;letter-spacing:2px;color:${YELLOW};">S</span>
    <div style="font-size:12px;color:#B8B2A8;margin-top:4px;">Descendants of Korean Adoptees</div>
    <div style="font-size:11px;color:#8A847A;margin-top:2px;letter-spacing:1px;">POWERED BY AK CONNECTION</div>
  </td></tr>
  <tr><td style="padding:28px 24px;font-size:16px;line-height:1.55;">
${bodyHtml}
  </td></tr>
  <tr><td style="padding:18px 24px;border-top:2px dashed #ccc4b4;font-size:12px;line-height:1.5;color:#6F675F;">
    You are getting this because you signed up at <a href="${site}" style="color:${BLUE};">dokads.com</a>.<br>
    <strong>Reply to this email any time</strong> to change or delete everything we hold about you — no form, no reason needed.
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:${RED};color:#ffffff;font-weight:bold;text-decoration:none;padding:12px 20px;border:2px solid ${INK};">${esc(label)}</a>`

const h1 = (t: string) =>
  `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.15;">${esc(t)}</h1>`

const note = (t: string) =>
  `<p style="background:${YELLOW};border:2px solid ${INK};padding:12px;margin:20px 0;font-size:14px;line-height:1.5;">${t}</p>`

/* ==========================================================================
   Event registration
   ========================================================================== */

export function registrationEmail(opts: {
  firstName: string
  event: DbEvent
  status: string
  site: string
}) {
  const { firstName, event, status, site } = opts
  const meta = STATUS_META[event.status as EventStatus]
  const provisional = event.status === 'tentative' || event.status === 'draft'
  const waitlisted = status === 'waitlist'
  const url = `${site}/events/${event.slug}`

  const subject = waitlisted
    ? `You're on the waitlist — ${event.title}`
    : provisional
      ? `We'll keep you posted — ${event.title}`
      : `You're registered — ${event.title}`

  const opener = waitlisted
    ? `This one is full, so you are on the waitlist. If a place opens up we will email you before we offer it to anyone else.`
    : provisional
      ? `Thanks for putting your name down. <strong>This event is not confirmed yet</strong> — we will email you the moment the details are settled, and you can change your mind at any point.`
      : `You are on the list. Here are the details.`

  const rows: [string, string][] = [
    ['Status', meta?.label ?? event.status],
    ['Date', formatEventDate(event.date, { long: true })],
    ...((event.backupDate
      ? [['Backup date', formatEventDate(event.backupDate, { long: true })]]
      : []) as [string, string][]),
    ['Time', `${event.time} ${event.timezone}`.trim()],
    ['Where', event.location],
    ['Who it’s for', AUDIENCE_META[event.audience as EventAudience]?.label ?? event.audience],
    ['Cost', event.cost],
  ]

  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6F675F;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:6px 0;font-weight:bold;">${esc(v)}</td></tr>`,
    )
    .join('')

  const unsettled =
    provisional && event.tentativeNotes?.length
      ? note(
          `<strong>What is not settled yet:</strong><br>` +
            event.tentativeNotes.map((n) => `• ${esc(n)}`).join('<br>'),
        )
      : ''

  const perk =
    event.perk && provisional
      ? `<p style="font-size:14px;color:#6F675F;">We are hoping to offer: ${esc(event.perk)}. Not confirmed yet — please do not count on it.</p>`
      : event.perk
        ? `<p style="font-size:14px;">${esc(event.perk)}.</p>`
        : ''

  const html = shell(
    subject,
    `${h1(`Hi ${firstName},`)}
<p style="margin:0 0 16px;">${opener}</p>
<h2 style="font-size:18px;margin:24px 0 8px;">${esc(event.title)}</h2>
<table role="presentation" cellpadding="0" cellspacing="0">${table}</table>
${unsettled}
${perk}
<p style="margin:24px 0 8px;">${btn(url, 'See the event page')}</p>
<p style="font-size:14px;color:#6F675F;margin-top:20px;">
Cannot make it any more? Just reply and say so — it helps us plan, and there is no awkwardness about it.
</p>`,
    site,
  )

  const text = `Hi ${firstName},

${opener.replace(/<[^>]+>/g, '')}

${event.title}
${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}
${provisional && event.tentativeNotes?.length ? `\nWhat is not settled yet:\n${event.tentativeNotes.map((n) => `- ${n}`).join('\n')}\n` : ''}
${url}

Cannot make it any more? Just reply and say so.

Reply to this email any time to change or delete everything we hold about you.`

  return { subject, html, text }
}

/* ==========================================================================
   Join
   ========================================================================== */

export function joinWelcomeEmail(opts: { name: string; site: string; isMinor: boolean }) {
  const { name, site, isMinor } = opts
  const subject = 'You’re in. Welcome to DOKADS.'

  const minorNote = isMinor
    ? note(
        `Because you told us you are under 18: we will not add you to public directories, ` +
          `research participation lists, or unrestricted community groups. Some events may ask ` +
          `for a parent or guardian to say yes first.`,
      )
    : ''

  const html = shell(
    subject,
    `${h1(`Welcome, ${name}.`)}
<p style="margin:0 0 16px;">
Thanks for joining a growing community of people exploring what it means to be a descendant
of a Korean adoptee. There is no one way to be a DoKAD, and you do not need to have
everything figured out before taking part.
</p>
${minorNote}
<p style="margin:16px 0 8px;"><strong>While you’re here:</strong></p>
<ul style="margin:0 0 20px;padding-left:20px;">
  <li style="margin-bottom:6px;"><a href="${site}/events" style="color:${BLUE};">See what’s coming up</a> — the first Minnesota meetup is penciled in, and the online sessions are open to everyone.</li>
  <li style="margin-bottom:6px;"><a href="${site}/stories" style="color:${BLUE};">Read the stories</a>, or send us one of your own.</li>
  <li style="margin-bottom:6px;"><a href="${site}/share" style="color:${BLUE};">Share DOKADS</a> — most people find this through someone else in their family.</li>
</ul>
<p style="margin:24px 0 8px;">${btn(`${site}/start`, 'Start here')}</p>
<p style="font-size:14px;color:#6F675F;margin-top:20px;">
Your answers help us decide what to run and when. Individual answers never appear publicly.
</p>`,
    site,
  )

  const text = `Welcome, ${name}.

Thanks for joining a growing community of people exploring what it means to be a
descendant of a Korean adoptee. There is no one way to be a DoKAD, and you do not
need to have everything figured out before taking part.
${isMinor ? '\nBecause you told us you are under 18: we will not add you to public directories, research participation lists, or unrestricted community groups.\n' : ''}
While you're here:
- What's coming up: ${site}/events
- Read the stories: ${site}/stories
- Share DOKADS: ${site}/share

Start here: ${site}/start

Your answers help us decide what to run and when. Individual answers never appear publicly.
Reply to this email any time to change or delete everything we hold about you.`

  return { subject, html, text }
}

/* ==========================================================================
   Admin notifications
   ========================================================================== */

export function adminNotifyEmail(opts: {
  kind: 'registration' | 'member' | 'submission'
  summary: string
  detail: string[]
  site: string
}) {
  const { kind, summary, detail, site } = opts
  const where =
    kind === 'registration'
      ? '/admin/registrations'
      : kind === 'member'
        ? '/admin/members'
        : '/admin/inbox'
  const subject = `DOKADS — ${summary}`

  const html = shell(
    subject,
    `${h1(summary)}
<ul style="margin:0 0 20px;padding-left:20px;">
${detail.map((d) => `<li style="margin-bottom:6px;">${esc(d)}</li>`).join('')}
</ul>
<p style="margin:24px 0 8px;">${btn(`${site}${where}`, 'Open the admin')}</p>`,
    site,
  )

  const text = `${summary}\n\n${detail.map((d) => `- ${d}`).join('\n')}\n\n${site}${where}`
  return { subject, html, text }
}

/* ==========================================================================
   Password reset (admin only)
   ========================================================================== */

export function resetPasswordEmail(opts: { url: string; site: string }) {
  const subject = 'Reset your DOKADS admin password'
  const html = shell(
    subject,
    `${h1('Reset your password')}
<p style="margin:0 0 16px;">
Someone asked to reset the password for a DOKADS admin account. If that was not you, you can
ignore this email and nothing will change.
</p>
<p style="margin:24px 0 8px;">${btn(opts.url, 'Choose a new password')}</p>
<p style="font-size:14px;color:#6F675F;margin-top:20px;word-break:break-all;">
Or paste this into your browser:<br>${esc(opts.url)}
</p>
<p style="font-size:14px;color:#6F675F;">This link expires in one hour.</p>`,
    opts.site,
  )
  const text = `Reset your DOKADS admin password

Someone asked to reset the password for a DOKADS admin account. If that was not you,
ignore this email and nothing will change.

${opts.url}

This link expires in one hour.`
  return { subject, html, text }
}

export const REPLY_TO_NOTE = `Replies go to ${emailReplyTo()}`
