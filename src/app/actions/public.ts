'use server'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { eventRegistrations, events, members, submissions } from '@/db/schema'
import { MINOR_AGES } from '@/data/joinForm'
import { sendQuietly } from '@/lib/email/send'
import {
  adminNotifyEmail,
  joinWelcomeEmail,
  registrationEmail,
} from '@/lib/email/templates'
import { siteUrl } from '@/lib/site-url'

/**
 * Cache invalidation is best-effort. It runs after the row is committed, so a
 * failure here must not tell someone their registration did not go through —
 * they would try again, hit the unique constraint, and get nothing.
 */
function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch (err) {
    console.error(`[action] revalidatePath("${path}") failed after a successful write`, err)
  }
}

/**
 * Where organiser notifications go. Unset means nobody is notified — the data
 * is still recorded and visible in the admin.
 */
function organiserInbox(): string | null {
  return process.env.ADMIN_NOTIFY_EMAIL?.trim() || null
}

export type ActionResult = { ok: true } | { ok: false; error: string }

/* ==========================================================================
   Shared rules
   Client-side validation is a convenience. These are the real ones.
   ========================================================================== */

const email = z.string().trim().toLowerCase().email('That does not look like an email address.')
const shortText = z.string().trim().max(200)

/** An optional free-text field. Blank and absent both normalise to null. */
const optText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null))

/** Optional email: blank is fine, but a value present must be valid. */
const optEmail = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null))
  .refine((v) => v === null || z.string().email().safeParse(v).success, {
    message: 'That does not look like an email address.',
  })

/** Age is a bracket, never a date of birth — and it decides the minors path. */
function minorFromAge(ageRange: string | null): boolean {
  return ageRange ? MINOR_AGES.has(ageRange) : false
}

function fail(err: unknown): ActionResult {
  if (err instanceof z.ZodError) {
    return { ok: false, error: err.issues[0]?.message ?? 'Please check the form and try again.' }
  }
  console.error('[action]', err)
  return { ok: false, error: 'Something went wrong on our end. Please try again.' }
}

/* ==========================================================================
   Join DOKADS
   ========================================================================== */

const joinSchema = z.object({
  name: z.string().trim().min(1, 'Please tell us what to call you.').max(120),
  email,
  connection: z.array(z.string()).max(20).default([]),
  description: z.array(z.string()).max(20).default([]),
  interests: z.array(z.string()).max(40).default([]),
  timing: z.array(z.string()).max(20).default([]),
  venues: z.array(z.string()).max(20).default([]),
  regionSlug: optText(),
  ageRange: optText(),
  wantsUpdates: z.boolean().default(false),
  wantsLocal: z.boolean().default(false),
  wantsVolunteer: z.boolean().default(false),
  agreedGuidelines: z
    .boolean()
    .refine((v) => v, 'Please agree to the community guidelines to continue.'),
})

export async function submitJoin(input: unknown): Promise<ActionResult> {
  try {
    const data = joinSchema.parse(input)
    await db
      .insert(members)
      .values({
        id: randomUUID(),
        name: data.name,
        email: data.email,
        connection: data.connection,
        description: data.description,
        interests: data.interests,
        timing: data.timing,
        venues: data.venues,
        regionSlug: data.regionSlug,
        ageRange: data.ageRange,
        // computed on the server so it cannot be spoofed from the client
        isMinor: minorFromAge(data.ageRange),
        wantsUpdates: data.wantsUpdates,
        wantsLocal: data.wantsLocal,
        wantsVolunteer: data.wantsVolunteer,
        agreedGuidelines: data.agreedGuidelines,
      })
      // signing up twice is not an error worth showing anyone
      .onConflictDoUpdate({
        target: members.email,
        set: {
          name: data.name,
          connection: data.connection,
          description: data.description,
          interests: data.interests,
          timing: data.timing,
          venues: data.venues,
          regionSlug: data.regionSlug,
          ageRange: data.ageRange,
          isMinor: minorFromAge(data.ageRange),
          wantsUpdates: data.wantsUpdates,
          wantsLocal: data.wantsLocal,
          wantsVolunteer: data.wantsVolunteer,
        },
      })

    // ---- committed. nothing below may turn this into a failure. ----
    const site = siteUrl()
    const isMinor = minorFromAge(data.ageRange)
    const welcome = joinWelcomeEmail({ name: data.name, site, isMinor })
    sendQuietly({ to: data.email, ...welcome })

    const inbox = organiserInbox()
    if (inbox) {
      sendQuietly({
        to: inbox,
        ...adminNotifyEmail({
          kind: 'member',
          summary: 'Someone new joined',
          detail: [
            `Region: ${data.regionSlug ?? 'not said'}`,
            `Age range: ${data.ageRange ?? 'not said'}${isMinor ? ' (under 18)' : ''}`,
            `Interested in: ${data.interests.join(', ') || 'not said'}`,
            data.wantsVolunteer ? 'Offered to help organise' : 'Did not offer to volunteer',
          ],
          site,
        }),
      })
    }

    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}

/* ==========================================================================
   Event registration
   ========================================================================== */

const registerSchema = z.object({
  eventSlug: shortText.min(1),
  firstName: z.string().trim().min(1, 'Please give us a first name.').max(80),
  lastName: optText(80),
  email,
  ageRange: optText(),
  city: optText(),
  connection: optText(),
  accessibility: optText(2000),
  dietary: optText(),
  wantsUpdates: z.boolean().default(false),
  agreedGuidelines: z
    .boolean()
    .refine((v) => v, 'Please agree to the community guidelines to continue.'),
})

export async function submitRegistration(input: unknown): Promise<ActionResult> {
  try {
    const data = registerSchema.parse(input)

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.slug, data.eventSlug))
      .limit(1)
    if (!event || event.status === 'draft') {
      return { ok: false, error: 'That event is not open for sign-ups.' }
    }
    if (event.status === 'cancelled' || event.status === 'completed') {
      return { ok: false, error: 'That event is no longer taking sign-ups.' }
    }

    const isMinor = minorFromAge(data.ageRange)
    if (event.minAge && isMinor) {
      return {
        ok: false,
        error: `This one is for ages ${event.minAge} and up. Plenty of others are all-ages.`,
      }
    }

    // capacity decides registered vs waitlist, on the server
    let status = 'registered'
    if (event.capacity) {
      const [{ n }] = await db
        .select({ n: sql<number>`count(*)` })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, event.id),
            eq(eventRegistrations.status, 'registered'),
          ),
        )
      if (Number(n) >= event.capacity) {
        if (!event.waitlist) return { ok: false, error: 'This one is full, and has no waitlist.' }
        status = 'waitlist'
      }
    }

    await db
      .insert(eventRegistrations)
      .values({
        id: randomUUID(),
        eventId: event.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        ageRange: data.ageRange,
        isMinor,
        city: data.city,
        connection: data.connection,
        accessibility: data.accessibility,
        dietary: event.needsFoodInfo ? data.dietary : null,
        wantsUpdates: data.wantsUpdates,
        agreedGuidelines: data.agreedGuidelines,
        status,
      })
      .onConflictDoNothing({
        target: [eventRegistrations.eventId, eventRegistrations.email],
      })

    // ---- committed. nothing below may turn this into a failure. ----
    safeRevalidate(`/events/${event.slug}`)

    const site = siteUrl()
    const confirmation = registrationEmail({
      firstName: data.firstName,
      event,
      status,
      site,
    })
    sendQuietly({ to: data.email, ...confirmation })

    const inbox = organiserInbox()
    if (inbox) {
      sendQuietly({
        to: inbox,
        ...adminNotifyEmail({
          kind: 'registration',
          summary: `New sign-up: ${event.title}`,
          detail: [
            `${data.firstName} ${data.lastName ?? ''}`.trim() + ` — ${data.email}`,
            `Status: ${status}`,
            `Age range: ${data.ageRange ?? 'not said'}${isMinor ? ' (under 18)' : ''}`,
            data.accessibility ? `Accommodation: ${data.accessibility}` : 'No accommodation request',
            data.dietary ? `Dietary: ${data.dietary}` : '',
          ].filter(Boolean),
          site,
        }),
      })
    }

    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}

/* ==========================================================================
   Resource suggestions + story pitches
   ========================================================================== */

const submissionSchema = z.object({
  kind: z.enum(['resource', 'story', 'contact']),
  name: optText(120),
  email: optEmail,
  subject: z.string().trim().min(1, 'Please add a short subject.').max(200),
  message: z.string().trim().min(1, 'Please add a little detail.').max(4000),
  payload: z.record(z.string(), z.unknown()).default({}),
})

export async function submitToInbox(input: unknown): Promise<ActionResult> {
  try {
    const data = submissionSchema.parse(input)
    await db.insert(submissions).values({
      id: randomUUID(),
      kind: data.kind,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      payload: data.payload,
    })

    const inbox = organiserInbox()
    if (inbox) {
      sendQuietly({
        to: inbox,
        ...adminNotifyEmail({
          kind: 'submission',
          summary: `New ${data.kind} submission`,
          detail: [
            `From: ${data.name ?? 'Anonymous'}${data.email ? ` (${data.email})` : ''}`,
            `Subject: ${data.subject}`,
            data.message.slice(0, 300),
          ],
          site: siteUrl(),
        }),
      })
    }

    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}
