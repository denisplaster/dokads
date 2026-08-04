import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/* ==========================================================================
   AUTH — Better Auth core tables
   `role` exists from day one so regional-organiser scoping can be added
   later without a migration on a live table.
   ========================================================================== */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  /** 'admin' sees everything; 'organiser' is scoped by regionSlug */
  role: text('role').notNull().default('organiser'),
  regionSlug: text('region_slug'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/* ==========================================================================
   CONTENT
   ========================================================================== */

export const regions = pgTable('regions', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  /** 'active' | 'forming' | 'interest' — only non-interest regions get a page */
  status: text('status').notNull().default('interest'),
  intro: text('intro'),
  organisers: jsonb('organisers').$type<{ name: string; role: string }[]>().default([]),
  socials: jsonb('socials')
    .$type<{ label: string; href: string | null; note?: string }[]>()
    .default([]),
  updates: jsonb('updates').$type<{ date: string; text: string }[]>().default([]),
  sortOrder: integer('sort_order').notNull().default(100),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const events = pgTable(
  'events',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    blurb: text('blurb').notNull().default(''),
    type: text('type').notNull(),
    /** draft | tentative | registration opening soon | registration open |
        waitlist | sold out | cancelled | completed */
    status: text('status').notNull().default('draft'),
    date: text('date').notNull(), // ISO yyyy-mm-dd; no timezone maths on a date
    backupDate: text('backup_date'),
    time: text('time').notNull().default(''),
    timezone: text('timezone').notNull().default(''),
    regionSlug: text('region_slug').notNull().default('online'),
    venueKind: text('venue_kind').notNull().default('online'),
    location: text('location').notNull().default(''),
    format: text('format').notNull().default('online'),
    audience: text('audience').notNull().default('open to all'),
    agePolicy: text('age_policy').notNull().default('all ages'),
    cost: text('cost').notNull().default('Free'),
    plusOnes: boolean('plus_ones').notNull().default(true),
    capacity: integer('capacity'),
    waitlist: boolean('waitlist').notNull().default(false),
    minAge: integer('min_age'),
    guardianConsentUnder: integer('guardian_consent_under'),
    deadline: text('deadline'),
    perk: text('perk'),
    /** what is explicitly NOT settled yet — rendered on the page */
    tentativeNotes: jsonb('tentative_notes').$type<string[]>().default([]),
    needsFoodInfo: boolean('needs_food_info').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [index('events_status_date_idx').on(t.status, t.date), index('events_region_idx').on(t.regionSlug)],
)

export const stories = pgTable('stories', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  dek: text('dek').notNull().default(''),
  kind: text('kind').notNull().default('essay'),
  byline: text('byline').notNull().default('Anonymous'),
  /** full name | first name | pseudonym | anonymous — the contributor's choice */
  bylineStyle: text('byline_style').notNull().default('anonymous'),
  location: text('location'),
  issue: text('issue').notNull().default('001'),
  readingTime: integer('reading_time').notNull().default(3),
  pullquote: text('pullquote'),
  art: text('art'),
  featured: boolean('featured').notNull().default(false),
  body: jsonb('body').$type<string[]>().notNull().default([]),
  /** draft | published */
  status: text('status').notNull().default('draft'),
  /** layout copy rather than a real contribution — shown with a visible flag */
  isPlaceholder: boolean('is_placeholder').notNull().default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const resources = pgTable('resources', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  blurb: text('blurb').notNull().default(''),
  format: text('format').notNull().default('read'),
  audience: jsonb('audience').$type<string[]>().notNull().default([]),
  badge: text('badge'),
  card: text('card').notNull().default('index'),
  link: text('link'),
  /** 'open call' until a real recommendation fills the slot */
  status: text('status').notNull().default('open call'),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(100),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/* ==========================================================================
   PEOPLE
   Everything below is personal data. Three rules, enforced here and in the
   admin rather than left to memory:
     1. `isMinor` is computed on write and gates exports + directories.
     2. individual rows are never rendered on a public page.
     3. every row is deletable on request, no questions asked.
   ========================================================================== */

export const members = pgTable(
  'members',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    /** plain-language answers — the form never requires the "DoKAD" label */
    connection: jsonb('connection').$type<string[]>().notNull().default([]),
    description: jsonb('description').$type<string[]>().notNull().default([]),
    interests: jsonb('interests').$type<string[]>().notNull().default([]),
    timing: jsonb('timing').$type<string[]>().notNull().default([]),
    venues: jsonb('venues').$type<string[]>().notNull().default([]),
    regionSlug: text('region_slug'),
    /** a bracket, never a date of birth */
    ageRange: text('age_range'),
    isMinor: boolean('is_minor').notNull().default(false),
    wantsUpdates: boolean('wants_updates').notNull().default(false),
    wantsLocal: boolean('wants_local').notNull().default(false),
    wantsVolunteer: boolean('wants_volunteer').notNull().default(false),
    agreedGuidelines: boolean('agreed_guidelines').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('members_email_idx').on(t.email),
    index('members_region_idx').on(t.regionSlug),
  ],
)

export const eventRegistrations = pgTable(
  'event_registrations',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    email: text('email').notNull(),
    ageRange: text('age_range'),
    isMinor: boolean('is_minor').notNull().default(false),
    city: text('city'),
    connection: text('connection'),
    accessibility: text('accessibility'),
    dietary: text('dietary'),
    wantsUpdates: boolean('wants_updates').notNull().default(false),
    agreedGuidelines: boolean('agreed_guidelines').notNull().default(false),
    /** registered | waitlist | cancelled | attended */
    status: text('status').notNull().default('registered'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('event_reg_unique_idx').on(t.eventId, t.email),
    index('event_reg_event_idx').on(t.eventId),
  ],
)

/** Lower-volume free-text submissions: resource suggestions, story pitches. */
export const submissions = pgTable(
  'submissions',
  {
    id: text('id').primaryKey(),
    /** 'resource' | 'story' | 'contact' */
    kind: text('kind').notNull(),
    name: text('name'),
    email: text('email'),
    subject: text('subject').notNull().default(''),
    message: text('message').notNull().default(''),
    /** kind-specific extras: shelf, byline preference, etc. */
    payload: jsonb('payload').$type<Record<string, unknown>>().default({}),
    /** new | read | actioned | archived */
    status: text('status').notNull().default('new'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('submissions_kind_status_idx').on(t.kind, t.status)],
)

export type DbEvent = typeof events.$inferSelect
export type DbStory = typeof stories.$inferSelect
export type DbRegion = typeof regions.$inferSelect
export type DbResource = typeof resources.$inferSelect
export type DbMember = typeof members.$inferSelect
export type DbEventRegistration = typeof eventRegistrations.$inferSelect
export type DbSubmission = typeof submissions.$inferSelect
