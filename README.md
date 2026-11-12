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
accounts** — with nothing set, the site runs in static mode from the files in
`src/data`.

### Three modes

`SITE_MODE` picks one. The public pages are prerendered in all three; what
changes is where their content comes from and what else exists.

| | `static` (unset) | `cms` — **live site** | `full` |
| --- | --- | --- | --- |
| Public content from | `src/data` files | Postgres, read **once per build** | Postgres, read once per build |
| Admin at `/admin` | 404 | yes — content, page text, editors, publish | yes, plus people |
| Forms, sign-ups, email to visitors | none | none | join, registration, submissions |
| Needs | nothing | `DATABASE_URL`, `BETTER_AUTH_SECRET`, `DEPLOY_HOOK_URL` | the same, plus optionally `RESEND_API_KEY` |

**Why the database is only read at build time.** In August the public pages
queried Neon on every request; crawlers sweeping the sitemap every few minutes
kept the compute from ever scaling to zero, and that was the bill. Now
`scripts/snapshot.ts` reads Postgres once, before `next build`, and writes
`src/generated/content.json`. Every public page renders from that file. A
visitor can never cause a query — `npm run static:verify` fails the build if
anything a public page renders imports the database. Neon wakes for exactly
two things: a build, and an editor using `/admin`.

### How editing works (cms)

1. An editor changes something in `/admin` and saves. That writes Postgres
   and marks content as changed (`site_meta`).
2. The yellow bar on every admin page says there are unpublished changes.
   **Publish site** POSTs to the Vercel deploy hook in `DEPLOY_HOOK_URL`.
3. Vercel rebuilds from `main`: `scripts/snapshot.ts` applies pending
   migrations (production builds only), reads the database, and the new pages
   go live in a minute or two. `scripts/mark-built.ts` records which snapshot
   is live, which is how the bar knows to say "up to date".

If the database cannot be read, the build fails and Vercel keeps serving the
previous deployment — a failed read never publishes an empty site. Preview
deployments have no `SITE_MODE`, so they build from the files and never touch
the database.

**What is editable.** Events, stories, resources and regions each have an
admin section. *Everything else* a visitor reads — every headline, paragraph,
button, note, menu label, footer line, status badge and page description — is
under **Pages**. Each piece of wording is declared once in
`src/content/pages/*.ts` with a label for the editor and a default (the text
the site shipped with). The admin stores only overrides (`page_copy`), so code
and database never need syncing by hand, and "Reset to original" just deletes
the override. To make new wording editable, add a field to the page's
definition and read it in the view with `copy('<page>')`; it appears in the
admin automatically. The rendered text of every page was verified identical to
the pre-CMS site when this was introduced.

Inline formatting editors can use anywhere: `**bold**`, `*italic*`,
`==highlight==`, `[link](https://…)` or `[link](/page)`. `src/components/Rich.tsx`
renders it; links to anything but http(s), mailto, tel or a site path are
dropped, and everything else is escaped text.

**The first time cms mode runs against a database**, the snapshot step copies
the site files into it (`importFilesIfNeeded`): records in the files overwrite
their database twins, and older database rows that the site was not showing are
hidden (draft / unpublished), never deleted. It runs once — after that the
database is the source of truth and `src/data` is only the static-mode
fallback and the vocabulary of types.

### Editors and access

Editors are managed in the admin under **Editors**: add someone and you get a
one-time link (48 hours) for them to choose their own password. Nobody else
ever sees it. The same page makes a new link for a locked-out editor, and
removes people (never yourself, never the last admin).

"Forgot password" emails need `RESEND_API_KEY`; without it, ask another
editor for a link. **If nobody can sign in at all**, run this with the
production connection string from the Neon console:

```bash
cd ~/code/dokads
export DATABASE_URL="postgresql://…neon.tech/neondb?sslmode=require"
ADMIN_EMAIL="person@example.com" npm run admin:link
unset DATABASE_URL
```

It creates the account if needed and prints a set-password link.

### Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Snapshot, then the dev server on :5190 |
| `npm run build` / `start` | Snapshot, production build, mark live; serve |
| `npm run snapshot` | Rewrite `src/generated/` from the files or the database |
| `npm run typecheck` | Types only |
| `npm run static:verify` | Public-site guarantees: drafts hidden, no database in the public tree, legal rules, modes |
| `npm run cms:verify` | Migrate → import → snapshot against in-process Postgres; db-built site equals file-built site |
| `npm run db:verify` | Schema + queries + privacy rules against in-process Postgres |
| `npm run email:verify` | Email failures cannot lose a registration (full mode) |
| `npm run admin:link` | Set-password link for an editor (creates the account if needed) |
| `npm run admin:create` | Create or promote an admin with a password you supply |
| `npm run db:generate` | New migration from `src/db/schema.ts` changes |
| `npm run db:migrate` | Apply migrations by hand (production builds also apply them) |

To try cms mode locally against a throwaway database:

```bash
SITE_MODE=cms DATABASE_URL=pglite://.data/cms npm run dev
ADMIN_EMAIL=you@example.com DATABASE_URL=pglite://.data/cms npm run admin:link
```

Locally, **Publish site** rewrites the snapshot the dev server is reading
instead of calling a deploy hook. PGlite is single-process: stop the dev server
before running a build against the same `.data` folder.

### Deploying to Vercel

The production project runs `SITE_MODE=cms`. It needs, on **Production**:

| Variable | Where it comes from |
| --- | --- |
| `SITE_MODE` | `cms` |
| `POSTGRES_URL` (or `DATABASE_URL`) | the Neon integration — already there |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` — already there |
| `BETTER_AUTH_URL` | `https://www.dokads.com` (recommended; links in emails use it) |
| `DEPLOY_HOOK_URL` | Vercel → Settings → Git → Deploy Hooks → create one for `main` |
| `RESEND_API_KEY` | optional — turns on forgot-password and invite emails |

Leave `SITE_MODE` unset on Preview so branch builds stay off the database.
Pushing to `main` deploys exactly like pressing Publish.

Migrations run automatically on production builds (`MIGRATE_ON_BUILD=1`
forces them elsewhere). Builds on Vercel run one at a time per project, which
is what makes that safe; if that ever changes, move migrations back to
`npm run db:migrate`.

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
| `/events` · `/events/:slug` | Flyer wall with status labels; email-to-come card (registration form in full mode) |
| `/regions` · `/regions/:slug` | Chapter index + regional landing pages (Minnesota is the pilot) |
| `/resources` | Community-nominated shelves with filters |
| `/join` | How to get in touch (the four-step questionnaire in full mode) |
| `/about` · `/guidelines` · `/privacy` | Community-led principle, conduct, data handling |
| `/share` | Outreach kit: copy snippets + four downloadable SVG assets |
| `/admin` | Editors only — see below |

## Admin

Sign in at `/admin` (the padlock in the footer). There is no public sign-up.

| Screen | Does |
| --- | --- |
| Overview | How editing works, content counts, where the content came from |
| Pages | Every piece of public wording that is not an event, story, resource or region |
| Events | Status lifecycle, details, host and recap, the "what is not settled yet" notes |
| Stories | Articles, credit style, order, sources, and the legal / immigration rules |
| Resources · Regions | The reading pile and the local groups |
| Editors | Add, unlock and remove the people who can sign in |
| Registrations · Members · Inbox | Personal data — shown in full mode, or while any is still stored |

The yellow **Publish site** bar sits on every screen; nothing an editor saves is
public until someone presses it.

**Authorisation.** Middleware bounces requests without a session cookie and
never touches the database, so bots probing `/admin` cost nothing. It is not
the security boundary — every admin page and every admin action calls
`requireStaff()`, which validates the session against the database. Page text
and editors are admin-only. `role` and `regionSlug` exist on `user` and
`regionScope()` is wired, so a regional organiser account is a config change.

**Enforced, not just documented.** A region cannot be set to *forming* or
*active* without at least one organiser. Draft events and stories never reach
the snapshot. A story marked legal / immigration cannot be published without a
review date, an official source and plain "not automatic" wording
(`src/content/legal.ts`, shared with `static:verify`). Minors are badged and
excluded from CSV exports unless you explicitly tick the box.

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
are honestly empty. In cms mode all of this is edited in the admin; the files
under `src/data` no longer feed the live site.

**No stock photos of Korean or mixed-race families, and no AI-generated people.**
`src/lib/collage.ts` generates deterministic abstract cut-paper artwork from a seed
string instead.

**Legal, immigration, citizenship, and visa content** (including the F-4) must be
reviewed for accuracy, show its review date, cite official sources, carry the
educational-not-legal-advice disclaimer, and never imply eligibility from a family
relationship alone. See `LEGAL_RULES` in `src/data/topics.ts`.

These are **enforced, not just documented**. A story marked legal / immigration must
have a review date and sources; `StoryPage` renders the disclaimer, the review date
and the source list automatically. The admin refuses to publish one that is missing
any of them, cites no official government source, or promises eligibility outright —
and `npm run static:verify` fails the build if one gets through anyway. Re-check the sources and bump `lastReviewed` whenever
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

## Rendering and data

Every public page is prerendered at build time from `src/generated/content.json`
(see **Three modes** above). Slug routes enumerate only published records, so a
draft has no page to find. Nothing public is server-rendered per request, which
is the point: there is nothing for traffic to wake.

| Where | Holds |
| --- | --- |
| Postgres (cms / full) | Events, stories, regions, resources, page-text overrides, editors, `site_meta` |
| `src/content/pages/*.ts` | Every piece of page wording, its admin label, and its default |
| `src/content/snapshot.ts` | The build-time snapshot the public site reads |
| `src/content/vocab.ts` | Status / type / kind labels with edits applied — small enough for client components |
| `src/data/*.ts` | Static-mode content, the one-time import source, and the type vocabulary |
| `src/lib/adapt.ts` | Database rows → the view types the components speak |

`npm run cms:verify` proves the database-built snapshot is identical to the
file-built one, that the import never deletes or touches personal data, that
edits survive later builds, and that malformed page-text overrides fall back to
the default instead of breaking a page.

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

**Mostly dormant.** In static and cms mode nothing is sent to visitors, because
nothing is collected. With `RESEND_API_KEY` set, cms mode sends exactly two
kinds of email, both to editors: forgot-password links and new-editor links.
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
  wired; Editors currently creates full admins only.
- **Preview before publishing.** Saving and publishing is the only way to see a
  change on the real pages; there is no draft preview of page text.
- **Downloadable share graphics** (`src/lib/shareAssets.ts`) are designed
  images whose wording is still in code.
- **No private social network**, deliberately — the site is the permanent
  searchable hub, and social platforms handle day-to-day conversation.
