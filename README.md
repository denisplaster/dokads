# DOKADS

A community and learning hub for **descendants of Korean adoptees** — the children,
grandchildren, and great-grandchildren of people adopted from Korea.

Built as a modern digital zine: bold, editorial, community-made, and readable.

---

## Run it

```bash
npm install && npm run dev
```

Dev server: <http://localhost:5190>

```bash
npm run build      # typecheck + production build to dist/
npm run typecheck  # types only
npm run preview    # serve the production build
```

Deploying to Vercel: import the repo, take the detected Vite preset. `vercel.json`
already rewrites all paths to `index.html` so client-side routes work on refresh.

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

## Data

Content lives in typed modules under `src/data/` — no CMS yet.

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

- Forms are front-end demonstrations — they do not submit anywhere.
- QR codes: `/share` leaves a slot; generate against the live domain.
- No CMS, no auth, no private social network (deliberately — the site is the permanent
  searchable hub, social platforms handle day-to-day conversation).
