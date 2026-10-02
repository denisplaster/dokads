# DOKADS

A community and learning hub for **descendants of Korean adoptees** — the children,
grandchildren, and great-grandchildren of people adopted from Korea.

Built as a modern digital zine: bold, editorial, community-made, and readable.

---

## Run it

```bash
npm install
npm run dev
```

Dev server: <http://localhost:5190>. **No configuration, no database, no
accounts** — the site runs in static mode by default.

### Static mode

The site is currently an informational brochure. Nothing it serves touches the
network:

- **Content** comes from the committed TypeScript modules in `src/data`, not
  Postgres. Every public page is prerendered at build time.
- **Nothing is collected.** No join form, no event registration, no analytics,
  no cookies. Pages that used to post a form now point at
  `dokads@akconnection.com`.
- **No email is sent.**
- **The admin is unreachable** — `/admin` and `/api/auth/*` return 404.
- **Fonts are self-hosted**, so loading a page reports nothing to anyone.

The database, auth, email and admin code all remain in the repository and keep
passing their suites. One switch turns them back on:

```bash
SITE_MODE=full      # + DATABASE_URL, BETTER_AUTH_SECRET, and optionally RESEND_API_KEY
```

`npm run static:verify` asserts the guarantees above so they cannot erode
quietly — including that drafts stay out of the public list, that no public
page imports the database, and that the mode switch actually works.

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server on :5190 |
| `npm run build` / `start` | Production build and serve |
| `npm run typecheck` | Types only |
| `npm run static:verify` | Assert the static-mode guarantees |
| `npm run db:verify` | Schema + queries against in-process Postgres (full mode) |
| `npm run email:verify` | Email failures cannot lose a registration (full mode) |
| `npm run db:setup` | `db:migrate` then `db:seed` — first-time setup (full mode) |
| `npm run db:seed` | Seed content. `-- --refresh-editorial` ships copy updates |
| `npm run admin:create` | Create or promote an admin (full mode) |
| `npm run email:test` | Send one real email to check a configuration |

### Deploying to Vercel

Import the repo and deploy. Static mode needs no environment variables, so the
first deploy works with nothing configured.

To go back to the full site: set `SITE_MODE=full`, add the Neon integration
(which injects `DATABASE_URL`), set `BETTER_AUTH_SECRET`, then run
`npm run db:setup` and `npm run admin:create` against the Neon connection
string from the Neon console. Resend is optional on top of that — see **Email**
below.

--- | --- |
| `npm run dev` | Dev server on :5190 |
| `npm run build` / `start` | Production build and serve |
| `npm run typecheck` | Types only |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply migrations (Neon) |
| `npm run db:setup` | `db:migrate` then `db:seed` — first-time setup |
| `npm run db:seed` | Seed content. Leaves existing rows alone; `-- --force` overwrites them |
| `npm run db:verify` | Run schema + queries against in-process Postgres |
| `npm run email:verify` | Prove email failures cannot lose a registration |
| `npm run email:test` | Send one real email to check a new configuration |
| `npm run db:studio` | Drizzle Studio |
| `npm run admin:create` | Create or promote an admin |

### Deploying to Vercel

1. Import the repo. Next.js is detected automatically.
2. Storage → add the **Neon** integration. It injects `DATABASE_URL`.
3. Set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`) and `BETTER_AUTH_URL`
   (your production URL).
4. Deploy. **The build does not touch the database**, so this succeeds before
   the schema exists.
5. Create the schema and content — once, from your machine. Get the real
   connection string from **Vercel → Storage → your Neon database → `.env.local`**
   (or the Neon console). Note the `cd`: these scripts only exist inside the
   project.

   ```bash
   cd ~/code/dokads
   export DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   npm run db:setup
   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="choose-a-long-passphrase" npm run admin:create
   unset DATABASE_URL ADMIN_PASSWORD
   ```

   `db:setup` runs `db:migrate` then `db:seed`. Pasting a connection string
   that still contains placeholder text fails immediately with an explanation
   rather than a confusing connection error.

Until step 5 runs, the static pages work and anything reading content returns
a Postgres `42P01` ("undefined table") — that error always means migrations
have not been applied to that database.

**Migrations are deliberately not part of the build.** Running them on every
deploy races across concurrent builds, and seeding on every deploy would fight
the admin. Run them when the schema actually changes.

Deploying with `DATABASE_URL` still set to `pglite://` is blocked with an
explicit error rather than failing mysteriously.

---

## What the site is for

Three connected jobs, in this order:

1. **An introduction** — help someone recognise whether this community includes them.
   Most visitors have never seen the word "DoKAD".
2. **A resource** — clear information about identity, family, Korea, adoption, and
   what travels between generations.
3. **A connection point** — events, local groups, stories, ways to take part.

The site's first question is never *"Do you identify as a DoKAD?"* It is
*"Was your parent or grandparent adopted from Korea?"*

---

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero, definition card, the four Who/What/Where/Why panels, featured stories, next events |
| `/start` | Six "which of these sounds like you" routes in |
| `/am-i-a-dokad` | The explainer: definition, generation diagram, interactive checklist. Print-ready. |
| `/learn` | Long-form Who/What/Where/Why + the editorial topic queue |
| `/stories` · `/stories/:slug` | The publication. Mixed layouts by piece type. |
| `/events` · `/events/:slug` | Flyer wall with status labels; per-event registration form |
| `/regions` · `/regions/:slug` | Chapter index + regional landing pages (Minnesota is the pilot) |
| `/resources` | Community-nominated shelves with filters |
| `/join` | Four-step questionnaire |
| `/about` · `/guidelines` · `/privacy` | Community-led principle, conduct, data handling |
| `/share` | Outreach kit: copy snippets + four downloadable SVG assets |
| `/admin` | Staff only — see below |

## Admin

Sign in at `/admin/sign-in`. There is no public sign-up.

| Screen | Does |
| --- | --- |
| Overview | Counts and aggregate planning tallies — interests, timing, venues, regions, age brackets. Deliberately the anonymous view. |
| Events | The status lifecycle, capacity, waitlist, age rules, and the "what is not settled yet" notes |
| Registrations | Per-event sign-ups, accommodation requests, waitlist moves, CSV export |
| Members | Join-form responses, CSV export, one-click delete |
| Inbox | Resource suggestions and story pitches |
| Stories / Resources / Regions | Content editing without a redeploy |

**Authorisation.** Middleware redirects when a session cookie is missing, but
it is not the security boundary — every admin page and every admin action
calls `requireStaff()`, which validates the session against the database.
`role` and `regionSlug` already exist on `user`, and `regionScope()` is wired,
so scoping a Minnesota organiser to Minnesota data is a config change rather
than a migration.

**Enforced, not just documented.** A region cannot be set to *forming* or
*active* without at least one organiser — the server refuses it, matching what
the site says publicly. Draft events are invisible to the public, including by
direct URL. Minors are badged, excluded from CSV exports unless you explicitly
tick the box, and surfaced on the dashboard.

---

## The design system

Everything decorative is a token or a component. Pages compose; pages do not invent
new colours, angles, or shadows.

```
src/styles/tokens.css   colours, type scale, spacing, rotation, shadow, texture, motion
src/styles/base.css     reset, focus, textures, reduced-motion, print
src/styles/zine.css     the reusable zine components
src/styles/layout.css   wordmark, nav, full-screen menu, footer
src/styles/pages.css    page compositions only
```

### Components

`ZineSection` · `SectionHead` · `TornEdge` · `PaperCard` · `TornPaperPanel` ·
`TapeStrip` · `Staple` · `Sticker` · `CategorySticker` · `IssueLabel` ·
`LocationStamp` · `HandwrittenNote` · `ScribbleUnderline` · `HandArrow` ·
`PullQuote` · `Marquee` · `EditorialHeadline` · `CollageFrame` · `FlyerEventCard` ·
`ZineArticleCard` · `EventStatusBadge` · `Wordmark` · `DokadDefinition`

### Rules that keep it from becoming noise

- **Rotation is a token.** Use `rot('tilt', -1)`, never a raw `deg`. Five angles exist:
  `hair` `nudge` `tilt` `lean` `wild`.
- **Tone drives colour.** `<ZineSection tone="blue">` sets `--surface` and
  `--on-surface`; everything inside inherits legible ink. Never hard-code a hex.
- **Black-and-white sections between colour sections.** Contrast is structural.
- **Texture is strategic**, not everywhere. Grain sits on colour fields; halftone on
  generated artwork.
- **Forms, articles, event details and filters stay structured.** Asymmetry is for
  editorial and promotional sections only.

### Contrast

Every surface pairing is measured; the ratios are recorded in `tokens.css`. Tomato red
is the tightest pairing and comes in three calibrated weights:

- `--red` — surfaces and accents. White on it is 4.8:1.
- `--red-text` — small red type on paper. 5.1:1.
- `--red-bright` — decoration only, never carries text.

### Typography

Three roles, three faces: **Anton** (display), **Archivo** (body), **Caveat** /
**Permanent Marker** (annotation). The handwritten faces never carry body copy, form
instructions, or navigation.

---

## Content conventions

These are load-bearing. Breaking them changes what the site claims.

**Nothing is presented as confirmed until it is.** Every event carries a
`status` — `draft` · `tentative` · `registration opening soon` · `registration open` ·
`waitlist` · `sold out` · `cancelled` · `completed` — and the UI renders it on every
card and detail page. Tentative events list exactly what is not settled.

**Regions only get a page when real organisers exist.** Anything else stays
`status: 'interest'` and renders as "nobody is running this yet".

**Editorial content is real; personal stories are never invented.** The articles in
`src/data/stories.ts` are researched explainers and guides bylined "DOKADS editorial",
fact-checked against live sources before shipping (43 claims verified, including every
resource URL, book attribution, and historical date). Personal narratives — essays,
interviews, poems, photo stories — come only from community submissions; the old
placeholder layouts were retired to draft, not passed off as real. Resource entries
name real books, films, podcasts, and organisations; shelves still marked *open call*
are honestly empty. Content updates ship with
`npm run db:seed -- --refresh-editorial`, which updates stories and resources but
never touches events or regions, so it cannot revert an event status set in the
admin.

**No stock photos of Korean or mixed-race families, and no AI-generated people.**
`src/lib/collage.ts` generates deterministic abstract cut-paper artwork from a seed
string instead.

**Legal, immigration, citizenship, and visa content** (including the F-4) must be
reviewed for accuracy, show its review date, cite official sources, carry the
educational-not-legal-advice disclaimer, and never imply eligibility from a family
relationship alone. See `LEGAL_RULES` in `src/data/topics.ts`.

These are **enforced, not just documented**. A story with `sensitive: true` must also
set `lastReviewed` and `sources`; `StoryPage` renders the disclaimer, the review date
and the source list automatically, and `npm run static:verify` fails if a sensitive
story is missing any of them, cites no official `.go.kr` source, or contains language
promising eligibility outright. Re-check the sources and bump `lastReviewed` whenever
you touch that content — immigration rules move.

**The community-led principle** — *DoKAD programming should be shaped and led by
DoKADs* — appears on About, the Minnesota page, and governs volunteer and event
planning. Adoptees, parents, organisations, and allies support; descendants lead.

**DOKADS is powered by AK Connection** — credited in the footer, the About page, the
Minnesota page, and the email header, with `dokads@akconnection.com` as the public
contact and reply-to address. Any *other* organisation is still named only once a
relationship is formally agreed, and the site never implies visitors are connected to
another organisation.

---

## Rendering

Content pages (`/`, `/events`, `/stories`, `/regions`, `/resources` and their
detail routes) are **server-rendered per request**. They were prerendered at
build time originally, which coupled every deploy to the database being both
reachable and migrated — a first deploy or a paused Neon branch failed the
build outright. A build should not depend on a database it does not own.

They are still server-rendered HTML, so nothing is lost for search engines or
link previews, and CMS edits appear with no revalidation to reason about. If
traffic ever justifies caching, add it back deliberately.

Everything without a database dependency — `/start`, `/am-i-a-dokad`,
`/learn`, `/about`, `/guidelines`, `/privacy`, `/share`, `/join` — is fully
static.

---

## Data

Postgres via Drizzle is the source of truth. The modules under `src/data/` are
now **seed material and the shared type vocabulary** — statuses, event types,
audiences, and the join-form choice lists. Do not edit content in both places.

`src/lib/adapt.ts` maps database rows onto the view types the components
speak, which is why moving content into Postgres left the design system
untouched.

`npm run db:verify` runs the real migration and seed against in-process
Postgres and asserts the rules that matter: drafts stay out of public reads,
interest-only regions are not publishable, duplicate emails and double
registrations are rejected, deletion works, and registrations cascade with
their event.

### Seed modules

| File | Holds |
| --- | --- |
| `pillars.ts` | Who / What / Where / Why |
| `stories.ts` | Articles + byline options (full name, first name, pseudonym, anonymous) |
| `events.ts` | Events, statuses, types, audiences, registration rules |
| `regions.ts` | Chapters and their publication status |
| `resources.ts` | Directory shelves |
| `topics.ts` | Editorial queue + the rules for sensitive content |
| `joinForm.ts` | Question bank, age brackets, minors notice, privacy lines |
| `community.ts` | Guidelines, community-led principle, tone bank |

---

## Accessibility

- WCAG AA contrast on every surface pairing, measured and documented.
- Full keyboard support; visible focus rings that flip colour on dark surfaces.
- Skip link, landmarks, one `h1` per page, labelled form controls, `aria-live` on
  results that appear after interaction.
- `prefers-reduced-motion` disables the marquee, sticker pops, and scroll animation.
- Rotation and texture are decorative only — no information depends on them.
- Age is optional, exact dates of birth are never collected, and under-18 visitors get
  an age-appropriate privacy notice and are excluded from public directories,
  research lists, and unrestricted groups.

---

## Email

**Dormant in static mode** — nothing is sent, because nothing is collected.
The rest of this section applies when `SITE_MODE=full`.

Transactional only, via [Resend](https://resend.com). Set these and it turns on;
leave them unset and the site works exactly as it does without them.

```bash
RESEND_API_KEY="re_..."                  # the only required variable
ADMIN_NOTIFY_EMAIL="you@example.com"     # optional organiser notifications
```

`akconnection.com` is verified in Resend, and the code defaults to sending from
and replying to `dokads@akconnection.com` — so the API key alone is enough.

`EMAIL_FROM` and `EMAIL_REPLY_TO` exist as overrides. **The FROM domain must be
verified in Resend or every send is rejected with a 403**, so do not point
`EMAIL_FROM` at `dokads.com` until that domain is verified too.

Then `EMAIL_TEST_TO="you@example.com" npm run email:test` sends one real message.
The admin overview shows a banner whenever email is off, so "nobody got a
confirmation" is never a silent failure.

What gets sent:

| When | To | Contains |
| --- | --- | --- |
| Event registration | The person | Status, date, location, and — while tentative — exactly what is not settled yet |
| Waitlisted | The person | Says waitlist plainly, and that they hear first if a place opens |
| Join | The person | Welcome, where to go next, and the minors notice if under 18 |
| Any of the above | Organisers | A summary and a link into the admin (needs `ADMIN_NOTIFY_EMAIL`) |
| Admin password reset | The admin | A one-hour link |

**A failed send can never lose data.** Every write commits first, and everything
after that boundary — cache invalidation included — is best-effort and cannot
turn a successful registration into an error. `npm run email:verify` proves it
against a real database with the provider both absent and actively throwing.

**`EMAIL_REPLY_TO` has to be a real mailbox.** Every email says replying is
enough to have your data deleted, and the site promises the same thing.

Newsletters are not built. Everything above is transactional, which is why
there is no unsubscribe link — the opt-in checkboxes are recorded but nothing
sends to them yet.

---

## Not built yet

- **Newsletter / bulk email.** The `wantsUpdates` and `wantsLocal` opt-ins are
  recorded, but nothing sends to them. That needs an unsubscribe mechanism
  before it ships.
- **QR codes.** `/share` leaves a slot; generate against the live domain.
- **Regional organiser accounts.** The role and scoping helper exist and are
  wired; no second account has been created yet.
- **No private social network**, deliberately — the site is the permanent
  searchable hub, and social platforms handle day-to-day conversation.
