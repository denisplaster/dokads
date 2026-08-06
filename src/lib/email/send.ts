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


/**
 * Transactional email.
 *
 * Two rules this module exists to enforce:
 *
 *  1. **A failed send must never lose data.** Every caller writes to the
 *     database first and sends afterwards. `send()` resolves rather than
 *     throws, so a provider outage cannot turn a successful registration into
 *     an error page for the person signing up.
 *
 *  2. **Unconfigured is a valid state.** With no RESEND_API_KEY the site works
 *     exactly as before — it just does not notify anyone. That is visible in
 *     the admin rather than silent.
 *
 * Uses the Resend HTTP API directly; it is one POST and not worth a dependency.
 */

const API = 'https://api.resend.com/emails'

export type Email = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export type SendResult =
  | { sent: true; id: string }
  | { sent: false; reason: 'not-configured' | 'failed'; detail?: string }

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && emailFrom())
}

export function emailFrom(): string {
  // Must be a domain verified in Resend, or every send 403s. akconnection.com
  // is the verified one, so it is the default — dokads.com would need its own
  // DNS records added in Resend before it could be used here.
  return process.env.EMAIL_FROM ?? 'DOKADS <dokads@akconnection.com>'
}

/**
 * The address people can reply to. The site promises that replying to any
 * email is enough to have your data deleted, so this has to be a mailbox
 * somebody actually reads.
 */
export function emailReplyTo(): string {
  return process.env.EMAIL_REPLY_TO ?? 'dokads@akconnection.com'
}

export async function send(email: Email): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn(
      `[email] not configured — would have sent "${email.subject}" to ${String(email.to)}`,
    )
    return { sent: false, reason: 'not-configured' }
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom(),
        to: Array.isArray(email.to) ? email.to : [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        reply_to: email.replyTo ?? emailReplyTo(),
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[email] provider rejected "${email.subject}": ${res.status} ${detail}`)
      return { sent: false, reason: 'failed', detail: `${res.status} ${detail}`.trim() }
    }

    const body = (await res.json()) as { id?: string }
    return { sent: true, id: body.id ?? 'unknown' }
  } catch (err) {
    console.error(`[email] send threw for "${email.subject}"`, err)
    return { sent: false, reason: 'failed', detail: String(err) }
  }
}

/**
 * Fire-and-forget wrapper for the common case: the caller has already
 * committed the important work and must not fail because of email.
 */
export function sendQuietly(email: Email): void {
  void send(email).catch((err) => console.error('[email] unexpected', err))
}
