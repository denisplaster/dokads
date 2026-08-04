/**
 * Sends one real email so a new configuration can be checked without
 * pretending to be a community member.
 *
 *   EMAIL_TEST_TO="you@example.com" npm run email:test
 */
import 'dotenv/config'
import { emailConfigured, emailFrom, emailReplyTo, send } from '../src/lib/email/send'

async function main() {
  const to = process.env.EMAIL_TEST_TO?.trim()
  if (!to) {
    console.error('Set EMAIL_TEST_TO to the address that should receive the test.')
    process.exit(1)
  }

  console.log('from:     ', emailFrom())
  console.log('reply-to: ', emailReplyTo())
  console.log('to:       ', to)

  if (!emailConfigured()) {
    console.error(
      '\nEmail is not configured. Set RESEND_API_KEY (and EMAIL_FROM if the default\n' +
        'sender is not verified on your domain).',
    )
    process.exit(1)
  }

  const res = await send({
    to,
    subject: 'DOKADS email test',
    html: '<p>If you are reading this, DOKADS can send email.</p><p>Try replying — replies should reach whoever handles deletion requests.</p>',
    text: 'If you are reading this, DOKADS can send email.\n\nTry replying — replies should reach whoever handles deletion requests.',
  })

  if (res.sent) {
    console.log(`\n✓ Sent (id ${res.id}). Reply to it to confirm the reply-to address works.`)
    process.exit(0)
  }
  console.error(`\n✗ Not sent: ${res.reason}${res.detail ? ` — ${res.detail}` : ''}`)
  process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
