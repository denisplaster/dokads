/**
 * ── EDITORIAL NOTE ────────────────────────────────────────────────────
 * Real, verifiable resources: books and films exist under these titles
 * and creators, organisations under these names, and every URL points at
 * the organisation it claims to. Entries carry `status`:
 *   'listed'    — a real recommendation (books/films without a stable
 *                 canonical URL say "library / bookshop" instead)
 *   'open call' — a shelf we are honestly still collecting for
 * The community keeps adding through the suggestion form; nothing here
 * pretends to be community-sourced when it is editorial.
 * ─────────────────────────────────────────────────────────────────────
 */

export type ResourceFormat =
  | 'read'
  | 'watch'
  | 'listen'
  | 'connect'
  | 'search'
  | 'learn'

export const FORMATS: Record<ResourceFormat, { label: string; verb: string }> = {
  read: { label: 'Read', verb: 'Read this' },
  watch: { label: 'Watch', verb: 'Watch this' },
  listen: { label: 'Listen', verb: 'Listen' },
  connect: { label: 'Connect', verb: 'Find your people' },
  search: { label: 'Search + records', verb: 'Research corner' },
  learn: { label: 'Background', verb: 'Start here' },
}

export type Audience = 'dokads' | 'parents' | 'teens' | 'korea' | 'everyone'

export const AUDIENCES: Record<Audience, string> = {
  everyone: 'Everyone',
  dokads: 'For DoKADs',
  parents: 'For parents',
  teens: 'For teens',
  korea: 'Going to Korea?',
}

export type ResourceCard = 'index' | 'sticky' | 'bookmark' | 'library' | 'clipping'

export type Resource = {
  id: string
  title: string
  blurb: string
  format: ResourceFormat
  audience: Audience[]
  badge?: 'Start here' | 'Community favourite' | 'Most asked about'
  card: ResourceCard
  /** null for books/films (find at a library) and for open calls */
  link: string | null
  status: 'listed' | 'open call'
}

export const resources: Resource[] = [
  /* ---------- READ: memoirs + essential books ---------- */
  {
    id: 'r-book-all-you-can-ever-know',
    title: 'All You Can Ever Know — Nicole Chung',
    blurb:
      'A Korean American adoptee’s memoir about growing up in a white family in Oregon, searching, and becoming a parent herself. The most common answer to “where do I start?”',
    format: 'read',
    audience: ['everyone', 'dokads'],
    badge: 'Start here',
    card: 'library',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-book-older-sister',
    title: 'Older Sister. Not Necessarily Related. — Jenny Heijun Wills',
    blurb:
      'A Korean adoptee raised in Canada writes about reunion with her birth family in Korea — fragmentary, honest about how complicated “finding them” actually is.',
    format: 'read',
    audience: ['dokads', 'everyone'],
    card: 'library',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-book-language-of-blood',
    title: 'The Language of Blood — Jane Jeong Trenka',
    blurb:
      'A foundational adoptee memoir: two sisters adopted to rural Minnesota, and what the author found when she traced the story back. Trenka later became a leading voice for adoptee rights in Korea.',
    format: 'read',
    audience: ['dokads', 'everyone'],
    card: 'library',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-book-palimpsest',
    title: 'Palimpsest — Lisa Wool-Rim Sjöblom',
    blurb:
      'A graphic memoir by a Korean adoptee raised in Sweden, about searching for her origins while expecting her first child. A reminder that this history runs through Europe too.',
    format: 'read',
    audience: ['dokads', 'teens'],
    card: 'library',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-book-outsiders-within',
    title: 'Outsiders Within — Trenka, Oparah & Shin (eds.)',
    blurb:
      'An anthology of writing by transracial adoptees across many countries and communities — essays, poetry, and scholarship in one place.',
    format: 'read',
    audience: ['everyone'],
    card: 'library',
    link: null,
    status: 'listed',
  },
  /* ---------- READ: history + research ---------- */
  {
    id: 'r-book-to-save-the-children',
    title: 'To Save the Children of Korea — Arissa Oh',
    blurb:
      'A historian’s account of how Korean adoption began and became a system: the war, the Holts, and the Cold War politics underneath. The academic backbone for our history explainer.',
    format: 'search',
    audience: ['everyone'],
    card: 'index',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-book-invisible-asians',
    title: 'Invisible Asians — Kim Park Nelson',
    blurb:
      'Based on extensive oral histories with adult Korean adoptees, much of it rooted in Minnesota. Scholarship where adoptees are the sources, not the subjects.',
    format: 'search',
    audience: ['everyone', 'dokads'],
    card: 'index',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-book-adopted-territory',
    title: 'Adopted Territory — Eleana J. Kim',
    blurb:
      'An anthropologist follows how adult Korean adoptees built a global community and returned to Seoul — the world DoKADs are now a second generation of.',
    format: 'search',
    audience: ['everyone'],
    card: 'index',
    link: null,
    status: 'listed',
  },
  /* ---------- WATCH ---------- */
  {
    id: 'r-film-first-person-plural',
    title: 'First Person Plural — Deann Borshay Liem',
    blurb:
      'The classic Korean adoptee documentary (2000): the filmmaker discovers her adoption file does not match who she is. Essential context for why records cannot always be trusted.',
    format: 'watch',
    audience: ['everyone'],
    badge: 'Start here',
    card: 'clipping',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-film-cha-jung-hee',
    title: 'In the Matter of Cha Jung Hee — Deann Borshay Liem',
    blurb:
      'The follow-up (2010): searching for the girl whose identity the filmmaker was sent to America under. About switched identities, decades before the truth commission confirmed how common they were.',
    format: 'watch',
    audience: ['everyone'],
    card: 'clipping',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-film-geographies-of-kinship',
    title: 'Geographies of Kinship — Deann Borshay Liem',
    blurb:
      'Four adoptees from different countries return to Korea, woven together with the history of how the adoption system grew (2019). The widest-angle film of the three.',
    format: 'watch',
    audience: ['everyone', 'korea'],
    card: 'clipping',
    link: null,
    status: 'listed',
  },
  {
    id: 'r-film-twinsters',
    title: 'Twinsters',
    blurb:
      'Two Korean adoptees — one raised in the US, one in France — discover each other through a YouTube video and find out they are identical twins (2015). The warmest possible entry point.',
    format: 'watch',
    audience: ['everyone', 'teens'],
    card: 'clipping',
    link: null,
    status: 'listed',
  },
  /* ---------- LISTEN ---------- */
  {
    id: 'r-pod-adapted',
    title: 'Adapted — Kaomi Goetz',
    blurb:
      'Long-running interview podcast in which adult Korean adoptees tell their own stories, season after season. The single best way to hear the range of the first generation’s experience.',
    format: 'listen',
    audience: ['dokads', 'everyone'],
    badge: 'Start here',
    card: 'sticky',
    link: 'https://adaptedpodcast.com',
    status: 'listed',
  },
  {
    id: 'r-pod-janchi',
    title: 'The Janchi Show',
    blurb:
      'Three Korean adoptees talk adoption, identity, and culture with humour that does not undercut the serious parts. Janchi means “party” or “feast.”',
    format: 'listen',
    audience: ['dokads', 'teens'],
    card: 'sticky',
    link: 'https://janchishow.com',
    status: 'listed',
  },
  {
    id: 'r-pod-adoptees-on',
    title: 'Adoptees On — Haley Radke',
    blurb:
      'Not Korea-specific, but the deepest archive of adoptees interviewing adoptees anywhere — useful for understanding the landscape your parent’s generation navigates.',
    format: 'listen',
    audience: ['everyone', 'parents'],
    card: 'sticky',
    link: 'https://adopteeson.com',
    status: 'listed',
  },
  /* ---------- CONNECT ---------- */
  {
    id: 'r-org-akconnection',
    title: 'AK Connection',
    blurb:
      'The Minnesota-based community organisation for adult Korean adoptees — in the state with one of the largest Korean adoptee populations anywhere. Our closest neighbours.',
    format: 'connect',
    audience: ['everyone', 'parents'],
    card: 'bookmark',
    link: 'https://www.akconnection.com',
    status: 'listed',
  },
  {
    id: 'r-org-alsoknownas',
    title: 'Also-Known-As',
    blurb:
      'A New York-based community for adult intercountry adoptees, founded and led by adoptees, running mentorship and cultural programming for decades.',
    format: 'connect',
    audience: ['everyone'],
    card: 'bookmark',
    link: 'https://www.alsoknownas.org',
    status: 'listed',
  },
  {
    id: 'r-org-ikaa',
    title: 'IKAA — International Korean Adoptee Associations',
    blurb:
      'The umbrella network linking Korean adoptee organisations worldwide, best known for the international Gatherings that bring hundreds of adoptees together in Seoul.',
    format: 'connect',
    audience: ['everyone', 'korea'],
    card: 'bookmark',
    link: 'https://www.ikaa.org',
    status: 'listed',
  },
  {
    id: 'r-org-kaan',
    title: 'KAAN',
    blurb:
      'The Korean American Adoptee Adoptive Family Network runs an annual conference that welcomes everyone connected to Korean adoption — adoptees, families, and increasingly the next generation.',
    format: 'connect',
    audience: ['everyone', 'parents', 'teens'],
    card: 'bookmark',
    link: 'https://www.wearekaan.org',
    status: 'listed',
  },
  {
    id: 'r-org-goal',
    title: 'GOA’L — Global Overseas Adoptees’ Link',
    blurb:
      'The adoptee-founded organisation in Seoul: birth-family search support, help navigating Korea, and services for adoptees returning short- or long-term.',
    format: 'connect',
    audience: ['korea', 'dokads'],
    card: 'bookmark',
    link: 'https://goal.or.kr',
    status: 'listed',
  },
  /* ---------- SEARCH + RECORDS ---------- */
  {
    id: 'r-search-ncrc',
    title: 'NCRC — National Center for the Rights of the Child',
    blurb:
      'The Korean government body that now holds post-adoption services: adoption file requests and official birth-family search. Note: the legal right to request records belongs to the adoptee themselves.',
    format: 'search',
    audience: ['dokads', 'korea'],
    badge: 'Most asked about',
    card: 'index',
    link: 'https://www.ncrc.or.kr',
    status: 'listed',
  },
  {
    id: 'r-search-325kamra',
    title: '325Kamra',
    blurb:
      'A nonprofit using DNA testing to reunite Korean adoptees with birth family — the route that works even when the paper trail is wrong or missing.',
    format: 'search',
    audience: ['dokads', 'everyone'],
    card: 'index',
    link: 'https://www.325kamra.org',
    status: 'listed',
  },
  /* ---------- LEARN: language + travel ---------- */
  {
    id: 'r-lang-ttmik',
    title: 'Talk To Me In Korean',
    blurb:
      'The friendliest structured way to learn Korean from zero — courses, podcasts, and books that assume no heritage-speaker household.',
    format: 'learn',
    audience: ['teens', 'dokads', 'everyone'],
    card: 'index',
    link: 'https://talktomeinkorean.com',
    status: 'listed',
  },
  {
    id: 'r-lang-htsk',
    title: 'How to Study Korean',
    blurb:
      'Free, exhaustive grammar lessons — the reference to keep open alongside whatever else you use.',
    format: 'learn',
    audience: ['everyone'],
    card: 'index',
    link: 'https://www.howtostudykorean.com',
    status: 'listed',
  },
  {
    id: 'r-travel-visitkorea',
    title: 'Visit Korea — official travel guide',
    blurb:
      'The Korea Tourism Organization’s English-language site: practical, current, and good for the ordinary-tourist layer of a first trip.',
    format: 'learn',
    audience: ['korea'],
    card: 'bookmark',
    link: 'https://english.visitkorea.or.kr',
    status: 'listed',
  },
  /* ---------- MENTAL HEALTH ---------- */
  {
    id: 'r-mh-directory',
    title: 'Finding a therapist who gets adoption',
    blurb:
      'Psychology Today’s directory lets you filter therapists by adoption as a specialty — so you do not spend six sessions explaining the basics. Many list telehealth.',
    format: 'connect',
    audience: ['everyone', 'parents'],
    card: 'clipping',
    link: 'https://www.psychologytoday.com/us/therapists/adoption',
    status: 'listed',
  },
  /* ---------- OPEN CALLS: shelves the community fills ---------- */
  {
    id: 'r-open-parents',
    title: 'For Korean adoptees raising kids',
    blurb:
      'Resources on talking to your children about your adoption — what to say, when, how much. We know of surprisingly little written for this exact situation; if something helped you, tell us.',
    format: 'read',
    audience: ['parents'],
    card: 'sticky',
    link: null,
    status: 'open call',
  },
  {
    id: 'r-open-teachers',
    title: 'For teachers assigning family-tree projects',
    blurb:
      'Alternatives to the standard assignment, and why the usual version lands badly for many students. Educators in the community: we would love your materials.',
    format: 'learn',
    audience: ['teens', 'parents'],
    card: 'sticky',
    link: null,
    status: 'open call',
  },
  {
    id: 'r-open-dokad-writing',
    title: 'Writing by DoKADs themselves',
    blurb:
      'Essays, zines, research, and art made by descendants of adoptees. This shelf is nearly empty because the field is that new — which is exactly why we want to fill it.',
    format: 'read',
    audience: ['dokads'],
    card: 'sticky',
    link: null,
    status: 'open call',
  },
]
