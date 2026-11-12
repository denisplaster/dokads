'use server'

import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/db'
import { touchContent } from '@/content/meta'
import { legalProblems } from '@/content/legal'
import {
  eventRegistrations,
  events,
  members,
  regions,
  resources,
  stories,
  submissions,
} from '@/db/schema'
import { requireStaff, regionScope } from '@/lib/auth-guard'
import type { Staff } from '@/lib/auth-guard'
import type { ActionResult } from './public'

/* Every action re-checks the session. Middleware is not a security boundary. */

function ok(): ActionResult {
  return { ok: true }
}
function err(message: string): ActionResult {
  return { ok: false, error: message }
}

/**
 * Record that public content changed.
 *
 * The public site is prerendered from a snapshot taken at build time, so an
 * edit is not live until someone presses Publish (which rebuilds). This marks
 * the change so the admin can say "you have unpublished changes", and
 * refreshes the admin so the banner appears straight away.
 */
async function changed(staff: Staff, what: string) {
  await touchContent(staff.email, what)
  revalidatePath('/admin', 'layout')
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((v) => (v ? v : null))

/* ==========================================================================
   EVENTS
   ========================================================================== */

const STATUSES = [
  'draft',
  'tentative',
  'registration opening soon',
  'registration open',
  'waitlist',
  'sold out',
  'cancelled',
  'completed',
] as const

const eventSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Slug can use lowercase letters, numbers and hyphens only.'),
  title: z.string().trim().min(1, 'A title is required.').max(200),
  blurb: z.string().trim().max(2000).default(''),
  type: z.string().trim().min(1),
  status: z.enum(STATUSES),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD.'),
  backupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((v) => (v ? v : null)),
  time: z.string().trim().max(80).default(''),
  timezone: z.string().trim().max(80).default(''),
  regionSlug: z.string().trim().min(1),
  venueKind: z.string().trim().min(1),
  location: z.string().trim().max(300).default(''),
  format: z.enum(['online', 'in person', 'hybrid']),
  audience: z.string().trim().min(1),
  agePolicy: z.string().trim().min(1),
  cost: z.string().trim().max(120).default('Free'),
  plusOnes: z.boolean().default(true),
  capacity: z.coerce.number().int().positive().optional().nullable(),
  waitlist: z.boolean().default(false),
  minAge: z.coerce.number().int().positive().optional().nullable(),
  guardianConsentUnder: z.coerce.number().int().positive().optional().nullable(),
  perk: z.string().trim().max(300).optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  tentativeNotes: z.array(z.string().trim().max(500)).max(20).default([]),
  needsFoodInfo: z.boolean().default(false),
  hostName: optionalText(200),
  hostHref: z
    .string()
    .trim()
    .url('The host’s page must be a full web address, starting https://')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((v) => (v ? v : null)),
  recap: optionalText(3000),
})

export async function saveEvent(input: unknown): Promise<ActionResult> {
  const staff = await requireStaff()
  try {
    const data = eventSchema.parse(input)

    const scope = regionScope(staff)
    if (scope && data.regionSlug !== scope) {
      return err('You can only manage events in your own region.')
    }

    const { hostName, hostHref, ...rest } = data
    if (hostName && !hostHref) return err('Add a link to the host’s page for this event, or clear the host name.')
    const values = {
      ...rest,
      host: hostName && hostHref ? { name: hostName, href: hostHref } : null,
      tentativeNotes: data.tentativeNotes.filter(Boolean),
      updatedAt: new Date(),
    }

    if (data.id) {
      await db.update(events).set(values).where(eq(events.id, data.id))
    } else {
      await db.insert(events).values({ ...values, id: randomUUID() })
    }

    await changed(staff, `event “${data.title}”`)
    return ok()
  } catch (e) {
    if (e instanceof z.ZodError) return err(e.issues[0]?.message ?? 'Check the form.')
    console.error(e)
    return err('Could not save that event.')
  }
}

/** The operation that actually matters day to day. */
export async function setEventStatus(id: string, status: string): Promise<ActionResult> {
  const staff = await requireStaff()
  if (!(STATUSES as readonly string[]).includes(status)) return err('Unknown status.')
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1)
  if (!row) return err('That event no longer exists.')

  await db.update(events).set({ status, updatedAt: new Date() }).where(eq(events.id, id))
  await changed(staff, `status of “${row.title}”`)
  return ok()
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can delete an event.')
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1)
  if (!row) return ok()
  await db.delete(events).where(eq(events.id, id))
  await changed(staff, `deleted event “${row.title}”`)
  return ok()
}

/* ==========================================================================
   STORIES
   ========================================================================== */

const storySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug can use lowercase letters, numbers and hyphens only.'),
  originalSlug: z.string().optional(),
  title: z.string().trim().min(1, 'A title is required.').max(300),
  dek: z.string().trim().max(1000).default(''),
  kind: z.string().trim().min(1),
  byline: z.string().trim().max(200).default('Anonymous'),
  bylineStyle: z.enum(['full name', 'first name', 'pseudonym', 'anonymous']),
  location: z.string().trim().max(200).optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  issue: z.string().trim().max(20).default('001'),
  readingTime: z.coerce.number().int().min(1).max(180).default(3),
  pullquote: z.string().trim().max(500).optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  art: z.string().trim().max(40).optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  featured: z.boolean().default(false),
  bodyText: z.string().default(''),
  status: z.enum(['draft', 'published']),
  isPlaceholder: z.boolean().default(false),
  sensitive: z.boolean().default(false),
  lastReviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'The review date must be a date.')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((v) => (v ? v : null)),
  /** one source per line: "Label | https://…" */
  sourcesText: z.string().max(5000).default(''),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(100),
})

/** "Label | https://address" per line → sources; a bare address uses itself as the label. */
function parseSources(text: string): { label: string; href: string }[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const at = l.lastIndexOf('|')
      if (at === -1) return { label: l, href: l }
      return { label: l.slice(0, at).trim() || l.slice(at + 1).trim(), href: l.slice(at + 1).trim() }
    })
}

export async function saveStory(input: unknown): Promise<ActionResult> {
  const staff = await requireStaff()
  try {
    const data = storySchema.parse(input)
    // one paragraph per blank-line-separated block; "> " marks a pull quote
    const body = data.bodyText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    const sources = parseSources(data.sourcesText)
    if (sources.some((s) => !/^https?:\/\//.test(s.href))) {
      return err('Each source needs a web address: “Label | https://…”, one per line.')
    }

    // the rules the site states publicly for legal and immigration content
    if (data.status === 'published') {
      const problems = legalProblems({ sensitive: data.sensitive, lastReviewed: data.lastReviewed, sources, body })
      if (problems.length) {
        return err(`This story is marked legal / immigration, so before it can be published: ${problems.join(' ')}`)
      }
    }

    const values = {
      slug: data.slug,
      title: data.title,
      dek: data.dek,
      kind: data.kind,
      byline: data.byline,
      bylineStyle: data.bylineStyle,
      location: data.location,
      issue: data.issue,
      readingTime: data.readingTime,
      pullquote: data.pullquote,
      art: data.art,
      featured: data.featured,
      body,
      status: data.status,
      isPlaceholder: data.isPlaceholder,
      sensitive: data.sensitive,
      lastReviewed: data.lastReviewed,
      sources,
      sortOrder: data.sortOrder,
      publishedAt: data.status === 'published' ? new Date() : null,
      updatedAt: new Date(),
    }

    if (data.originalSlug) {
      await db.update(stories).set(values).where(eq(stories.slug, data.originalSlug))
    } else {
      await db.insert(stories).values(values)
    }

    await changed(staff, `story “${data.title}”`)
    return ok()
  } catch (e) {
    if (e instanceof z.ZodError) return err(e.issues[0]?.message ?? 'Check the form.')
    console.error(e)
    return err('Could not save that story.')
  }
}

export async function deleteStory(slug: string): Promise<ActionResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can delete a story.')
  await db.delete(stories).where(eq(stories.slug, slug))
  await changed(staff, `deleted story ${slug}`)
  return ok()
}

/* ==========================================================================
   RESOURCES
   ========================================================================== */

const resourceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, 'A title is required.').max(300),
  blurb: z.string().trim().max(2000).default(''),
  format: z.string().trim().min(1),
  audience: z.array(z.string()).max(10).default([]),
  badge: z.string().trim().max(60).optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  card: z.string().trim().min(1),
  link: z.string().trim().url('That link does not look like a URL.').optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(100),
})

export async function saveResource(input: unknown): Promise<ActionResult> {
  const staff = await requireStaff()
  try {
    const data = resourceSchema.parse(input)
    const values = { ...data, status: data.link ? 'listed' : 'open call', updatedAt: new Date() }
    if (data.id) {
      await db.update(resources).set(values).where(eq(resources.id, data.id))
    } else {
      await db.insert(resources).values({ ...values, id: randomUUID() })
    }
    await changed(staff, `resource “${data.title}”`)
    return ok()
  } catch (e) {
    if (e instanceof z.ZodError) return err(e.issues[0]?.message ?? 'Check the form.')
    console.error(e)
    return err('Could not save that resource.')
  }
}

export async function deleteResource(id: string): Promise<ActionResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can delete a resource.')
  await db.delete(resources).where(eq(resources.id, id))
  await changed(staff, 'deleted a resource')
  return ok()
}

/* ==========================================================================
   REGIONS
   ========================================================================== */

const regionSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  originalSlug: z.string().optional(),
  name: z.string().trim().min(1, 'A name is required.').max(200),
  country: z.string().trim().min(1).max(120),
  status: z.enum(['active', 'forming', 'interest']),
  intro: z.string().trim().max(3000).optional().nullable().or(z.literal('')).transform((v) => (v ? v : null)),
  organisers: z.array(z.object({ name: z.string().trim(), role: z.string().trim() })).max(30).default([]),
  socials: z
    .array(
      z.object({
        label: z.string().trim(),
        href: z.string().trim().nullable(),
        note: z.string().trim().optional(),
      }),
    )
    .max(20)
    .default([]),
  updates: z.array(z.object({ date: z.string().trim(), text: z.string().trim() })).max(50).default([]),
})

export async function saveRegion(input: unknown): Promise<ActionResult> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') return err('Only an admin can edit regions.')
  try {
    const data = regionSchema.parse(input)

    // the rule the site states publicly: a region page needs real organisers
    if (data.status !== 'interest' && data.organisers.filter((o) => o.name).length === 0) {
      return err(
        'A region only gets a public page once it has at least one organiser. ' +
          'Add an organiser, or leave the status as "gathering interest".',
      )
    }

    const values = {
      slug: data.slug,
      name: data.name,
      country: data.country,
      status: data.status,
      intro: data.intro,
      organisers: data.organisers.filter((o) => o.name),
      socials: data.socials.filter((s) => s.label),
      updates: data.updates.filter((u) => u.text),
      updatedAt: new Date(),
    }

    if (data.originalSlug) {
      await db.update(regions).set(values).where(eq(regions.slug, data.originalSlug))
    } else {
      await db.insert(regions).values(values)
    }

    await changed(staff, `region “${data.name}”`)
    return ok()
  } catch (e) {
    if (e instanceof z.ZodError) return err(e.issues[0]?.message ?? 'Check the form.')
    console.error(e)
    return err('Could not save that region.')
  }
}

/* ==========================================================================
   PEOPLE — deletion is a promise the site makes, so it must always work
   ========================================================================== */

export async function deleteMember(id: string): Promise<ActionResult> {
  await requireStaff()
  await db.delete(members).where(eq(members.id, id))
  revalidatePath('/admin/members')
  revalidatePath('/admin')
  return ok()
}

export async function deleteRegistration(id: string): Promise<ActionResult> {
  await requireStaff()
  await db.delete(eventRegistrations).where(eq(eventRegistrations.id, id))
  revalidatePath('/admin/registrations')
  return ok()
}

export async function setRegistrationStatus(id: string, status: string): Promise<ActionResult> {
  await requireStaff()
  if (!['registered', 'waitlist', 'cancelled', 'attended'].includes(status)) {
    return err('Unknown status.')
  }
  await db.update(eventRegistrations).set({ status }).where(eq(eventRegistrations.id, id))
  revalidatePath('/admin/registrations')
  return ok()
}

export async function setSubmissionStatus(id: string, status: string): Promise<ActionResult> {
  await requireStaff()
  if (!['new', 'read', 'actioned', 'archived'].includes(status)) return err('Unknown status.')
  await db.update(submissions).set({ status }).where(eq(submissions.id, id))
  revalidatePath('/admin/inbox')
  revalidatePath('/admin')
  return ok()
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  await requireStaff()
  await db.delete(submissions).where(eq(submissions.id, id))
  revalidatePath('/admin/inbox')
  return ok()
}
