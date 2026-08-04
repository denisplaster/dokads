# DOKADS

A community and learning hub for **descendants of Korean adoptees** — the children,
grandchildren, and great-grandchildren of people adopted from Korea.

Built as a modern digital zine: bold, editorial, community-made, and readable.

---

## Run it

```bash
npm install
cp .env.example .env      # then set DATABASE_URL + BETTER_AUTH_SECRET
npm run db:seed           # applies migrations (local) and seeds content
npm run dev
```

Dev server: <http://localhost:5190>

**Database.** Production runs on Neon. For local work you can either paste a
Neon *branch* connection string into `.env`, or use the zero-setup option:

```bash
DATABASE_URL="pglite://.data/dev"
```

That runs Postgres in-process — no account, no daemon. One caveat: it is a
single-process file database, so do not run `npm run dev` and `npm run build`
at the same time. If the directory gets corrupted, `rm -rf .data && npm run
db:seed` and you are back.

**Admin account.** Choose your own password; it is hashed and never stored in
plain text.

```bash
ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-long-passphrase" npm run admin:create
```

Then sign in at `/admin/sign-in`, and unset `ADMIN_PASSWORD` from your shell.

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server on :5190 |
| `npm run build` / `start` | Production build and serve |
| `npm run typecheck` | Types only |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply migrations (Neon) |
| `npm run db:seed` | Seed content. Leaves existing rows alone; `-- --force` overwrites them |
| `npm run db:verify` | Run schema + queries against in-process Postgres |
| `npm run db:studio` | Drizzle Studio |
| `npm run admin:create` | Create or promote an admin |

### Deploying to Vercel

1. Import the repo. Next.js is detected automatically.
2. Storage → add the **Neon** integration. It injects `DATABASE_URL`.
3. Set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`) and `BETTER_AUTH_URL`
   (your production URL).
4. Deploy. **The build does not touch the database**, so this succeeds before
   the schema exists.
5. Create the schema and content — once, from your machine, against the Neon
   connection string from the Vercel dashboard:

   ```bash
   export DATABASE_URL="postgresql://…neon.tech/neondb?sslmode=require"
   npm run db:migrate
   npm run db:seed
   ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-long-passphrase" npm run admin:create
   unset DATABASE_URL ADMIN_PASSWORD
   ```

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

**Placeholder content is labelled as placeholder.** `src/data/stories.ts` is layout
copy, not anyone's real family, and the Stories page says so. Resource entries describe
what a shelf collects rather than inventing titles or links. Delete the
`isPlaceholder` / `status: 'open call'` flags as real content replaces them.

**No stock photos of Korean or mixed-race families, and no AI-generated people.**
`src/lib/collage.ts` generates deterministic abstract cut-paper artwork from a seed
string instead.

**Legal, immigration, citizenship, and visa content** (including the F-4) must be
reviewed for accuracy, show its review date, cite official sources, carry the
educational-not-legal-advice disclaimer, and never imply eligibility from a family
relationship alone. See `LEGAL_RULES` in `src/data/topics.ts`.

**The community-led principle** — *DoKAD programming should be shaped and led by
DoKADs* — appears on About, the Minnesota page, and governs volunteer and event
planning. Adoptees, parents, organisations, and allies support; descendants lead.

**AK Connection and any other organisation** is named as a partner only once that
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

## Not built yet

- **Email.** Nothing is sent — no confirmations, no newsletter, no password
  reset. Registrations and joins are recorded but nobody is notified.
- **QR codes.** `/share` leaves a slot; generate against the live domain.
- **Regional organiser accounts.** The role and scoping helper exist and are
  wired; no second account has been created yet.
- **No private social network**, deliberately — the site is the permanent
  searchable hub, and social platforms handle day-to-day conversation.
