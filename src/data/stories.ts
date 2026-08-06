import type { CollageVariant } from '../lib/collage'

/**
 * ── EDITORIAL NOTE ────────────────────────────────────────────────────
 * Everything below is real editorial content, researched and written by
 * the DOKADS editorial team — explainers and practical guides, not
 * personal narratives. Personal stories (essays, interviews, poems,
 * photo stories) are contributed by community members through the
 * submission process and never invented.
 *
 * These modules are the seed source; the database is the source of
 * truth once seeded. RETIRED_STORY_SLUGS in scripts/seed.ts hides the
 * old placeholder layout copy.
 * ─────────────────────────────────────────────────────────────────────
 */

export type StoryKind =
  | 'essay'
  | 'interview'
  | 'photo'
  | 'poetry'
  | 'audio'
  | 'question'
  | 'explainer'

export const STORY_KINDS: Record<StoryKind, { label: string; note: string }> = {
  essay: { label: 'Personal essay', note: 'First person, written' },
  interview: { label: 'Interview', note: 'Two people, in conversation' },
  photo: { label: 'Photo story', note: 'Images lead, words follow' },
  poetry: { label: 'Poetry', note: 'Short form' },
  audio: { label: 'Audio', note: 'Listen instead of read' },
  question: { label: 'Community question', note: 'Open thread' },
  explainer: { label: 'Explainer', note: 'Context and background' },
}

export type Story = {
  slug: string
  title: string
  dek: string
  kind: StoryKind
  byline: string
  /** how the contributor chose to be credited */
  bylineStyle: 'full name' | 'first name' | 'pseudonym' | 'anonymous'
  location?: string
  issue: string
  readingTime: number
  pullquote?: string
  art?: CollageVariant
  featured?: boolean
  /** paragraphs; `> ` prefix renders as a pull quote */
  body: string[]
  /** layout copy rather than real content — rendered with a visible flag */
  isPlaceholder: boolean
}

const ED = {
  byline: 'DOKADS editorial',
  bylineStyle: 'full name' as const,
  issue: '001',
  isPlaceholder: false,
}

export const stories: Story[] = [
  {
    slug: 'a-short-history-of-korean-adoption',
    title: 'A short history of Korean adoption',
    dek: 'Around 200,000 children were adopted out of Korea over seven decades. Here is how that happened, decade by decade — and why the story is still moving.',
    kind: 'explainer',
    ...ED,
    readingTime: 8,
    pullquote: 'Adoption from Korea was never one story. It changed decade by decade.',
    art: 'strip',
    featured: true,
    body: [
      'If your parent or grandparent was adopted from Korea, they were part of the largest and longest-running international adoption movement in history. Around 200,000 children were adopted out of South Korea from the 1950s onward — most to the United States, and large numbers to France, Denmark, Sweden, Norway, the Netherlands, Belgium, Germany, Canada, and Australia. Very few families were ever handed the context for how that came to be. This is the short version.',
      'It began with a war. The Korean War (1950–1953) left the peninsula divided and the South devastated, with enormous numbers of children orphaned or separated from family. Among the most vulnerable were mixed-race children born to Korean mothers and foreign soldiers. In a society that traced belonging through paternal bloodlines, these children faced severe stigma, and the earliest overseas adoptions were framed largely as a response to their situation.',
      'In 1955, an evangelical farming couple from Oregon, Harry and Bertha Holt, adopted eight Korean children — an act that required a special bill in the US Congress, because American law did not yet allow it. The publicity around the Holts was enormous, and the organisation they founded became one of the largest adoption agencies in the world. A system built for a postwar emergency now had permanent infrastructure.',
      '> The emergency ended. The system kept running.',
      'By the 1970s and 1980s, the children leaving Korea were mostly not war orphans. Korea was industrialising at extraordinary speed, but social welfare had not caught up, and the stigma against unmarried mothers was severe — most had no realistic way to keep a child. Domestic adoption was rare and usually secret. Sending children abroad became the path of least resistance, and at the peak in the mid-1980s, more than 8,000 children a year were leaving the country.',
      'The 1988 Seoul Olympics changed the mood. With the world watching, foreign press coverage described Korea — by then a rising industrial power — as a country that exported its own children. The embarrassment was acute, and the government began setting quotas and pledging reductions. The numbers fell through the 1990s and 2000s, though adoptions continued at a smaller scale.',
      'Meanwhile, the first generations grew up — and came back. From the late 1990s onward, adult adoptees began organising internationally: the first large adoptee Gathering was held in 1999, adoptee-led organisations formed in Seoul and across the West, and returning adoptees became a visible presence in Korea. Adoptee activists also drove legal change. The Special Adoption Law, revised in 2012, required court approval for adoptions, tightened birth registration, and gave adoptees a legal route to request their own records. Post-adoption services — including file access and birth-family search — are now handled by a national body, the National Center for the Rights of the Child (NCRC).',
      'The reckoning is recent and ongoing. Korea’s Truth and Reconciliation Commission spent 2022 to 2025 investigating hundreds of cases brought by adoptees, and in March 2025 it announced its first findings: in many of the cases examined, children had been documented as orphans when they were not, identities had been switched or fabricated, and proper consent was missing. The commission described the state as responsible for failures of oversight and recommended an official apology. Separately, Korea passed a law in 2023 moving intercountry adoption from private agencies to state responsibility, which took effect in 2025.',
      'Why does any of this matter to a descendant? Because it is not ancient history. The paperwork in your family’s closet was produced by this system, and it may be incomplete or wrong through no fault of anyone in your family. The news from the Truth and Reconciliation Commission lands in living rooms and group chats now, in your parent’s generation and yours. Understanding the history will not answer every question — but it turns a private, confusing story into a shared one with context, which is a very different thing to carry.',
      'Further reading: the books on our Resources page — including work by historians and scholars of Korean adoption — go far deeper than this summary can.',
    ],
  },
  {
    slug: 'what-even-is-a-dokad',
    title: 'What even is a DoKAD?',
    dek: 'The short version, the long version, and why the term exists at all.',
    kind: 'explainer',
    ...ED,
    readingTime: 4,
    pullquote: 'There is no single way to be a DoKAD.',
    art: 'grid',
    featured: true,
    body: [
      'DoKAD is shorthand for descendant of a Korean adoptee — the child, grandchild, or great-grandchild of someone who was adopted from Korea. It is the term this community uses for itself, and if you have never seen it before, that is normal: most people who fit the description have never heard the word.',
      'The maths behind the term is simple. Around 200,000 children were adopted out of South Korea from the 1950s onward. The first generation are now well into adulthood; many are parents and some are grandparents. That second and third generation — the people who inherited this history without living its first chapter — is who DOKADS is for.',
      '> The word is a useful handle, not a test. Nobody has to qualify.',
      'Some DoKADs grew up close to Korean culture. Some grew up with almost none of it. Some are mixed race, some are not. Some have birth-family information; most do not. Some parents talk about their adoption constantly; some have never mentioned it once. All of that is inside the word.',
      'Why have a word at all? Because naming an experience makes it findable. Before there was a term, a child of a Korean adoptee wondering about their family history had nothing to search for and nobody obvious to ask. A shared word turns thousands of people quietly carrying the same odd set of facts into a community that can find each other — which is the entire point of this site.',
      'And to be clear about the other direction: you do not have to use it. Plenty of people come to events, read everything here, and never once call themselves a DoKAD. The label is a door, not a badge.',
    ],
  },
  {
    slug: 'why-descendants-experience-adoption-differently',
    title: 'Why descendants may experience adoption differently',
    dek: 'You inherited a history you did not live through. That is its own experience — related to your parent’s, but not the same one.',
    kind: 'explainer',
    ...ED,
    readingTime: 6,
    pullquote: 'Your parent’s story and your story can be connected without being identical.',
    art: 'cut',
    featured: true,
    body: [
      'Almost everything written about Korean adoption is about adoptees — reasonably, since it happened to them. But their children and grandchildren grow up inside the outcome, and that is a distinct experience that has barely been studied or described. Here is what tends to make it different, said carefully: every one of these applies to many descendants and none applies to all.',
      'The gaps are inherited. A family medical history form with one side blank. A family tree assignment that hits a hard stop two generations up. Questions about names, birthplaces, or relatives that have no answer — not because anyone is withholding it, but because the answer may genuinely not exist. Adoptees live these gaps first; their children inherit them without ever having chosen the silence.',
      'Race can arrive without the culture that usually comes with it. Many descendants carry visible Korean ancestry, and the world responds to it — questions, assumptions, sometimes worse — without their having been handed the language, food, and customs that people expect to accompany that face. Others, especially mixed-race descendants, are not read as Korean at all and carry the connection invisibly. Both versions can be disorienting, and neither is wrong.',
      '> The questions did not end with the first generation. They moved.',
      'You watch a parent carry it. Some adoptees search for birth family; some refuse to discuss the subject; many move between those poles over a lifetime. Growing up close to that — sensing which questions are welcome and which are not — shapes descendants in ways that are hard to name. Wanting to know more about your own history can feel like trespassing on your parent’s.',
      'The distance cuts both ways. A generation of remove can make Korea feel like an open, low-stakes inheritance — yours to explore without the weight an adoptee may carry. The same distance can make any claim to it feel unearned, as if the connection thinned out before it reached you. Many descendants feel both at different moments.',
      'And until recently, there was nowhere to put any of this. Adoptee organisations exist worldwide, but they were built by and for adoptees. Descendants asking these questions have mostly asked them alone — which is precisely the problem a community like this exists to solve. None of what is described here is a crisis, and none of it needs fixing. But all of it is easier in company.',
    ],
  },
  {
    slug: 'talking-to-your-adoptee-parent',
    title: 'Talking to your Korean adoptee parent about adoption',
    dek: 'There is no script for asking a parent about the biggest thing that ever happened to them. There are better and worse ways to start.',
    kind: 'explainer',
    ...ED,
    readingTime: 7,
    pullquote: 'Curiosity is welcome. An interrogation is not. The difference is who holds the exit.',
    art: 'stack',
    body: [
      'One of the most common reasons people find this site is that they want to ask a parent about their adoption and do not know how — or whether — to start. There is no script that works for every family. But people who have navigated this well tend to follow a few principles, and they are worth writing down.',
      'Start here: the story belongs to them. Your parent’s adoption happened to your parent. You have a real stake in it — it is your history too — but the telling of it is theirs to control. Holding both of those at once is the whole art of this conversation.',
      'Say why you are asking. “I have been thinking about my own history” lands very differently from a question out of nowhere. Naming your reason — a school assignment years ago that never got answered, a medical form, plain curiosity, this website — gives your parent something to respond to besides surprise.',
      'Pick a low-stakes moment, and prefer objects to feelings. Big questions go better side by side than face to face: in the car, cooking, looking through a box. Artifacts are a gentler door than emotions — a photograph, a document, a food, a name. “What is this from?” is easier to answer than “How do you feel about being adopted?”, and it often leads to the same place.',
      '> Expect “I don’t know” — and believe it.',
      'Korean adoption records are famously incomplete, and Korea’s own truth commission has confirmed that many files contain fabricated information. When your parent says they do not know something, that is very often the literal truth, and pushing past it implies you think they are holding out. Some of the gaps in your family history have no answer available to anyone.',
      'Accept “not now” without treating it as “never”. Some adoptees have spent decades building a workable peace with this subject, and a conversation you are ready for may be one they are not. If the door closes, let it close gently — people often come back to a question months later, once it has stopped feeling like an ambush. Several small conversations over years beat one big one almost every time.',
      'If it goes badly, repair beats retreat. A short follow-up — “I did not mean to push. I asked because it matters to me. No rush.” — keeps the door on its hinges. And if this subject carries real weight in your family, a therapist who understands adoption is not an admission of crisis; it is a tool. Our Resources page lists ways to find one.',
      'Finally: you are allowed to have your own relationship to this history, including the parts your parent never wants to discuss. That is much easier to hold when you know other people in the same position — which is, again, why this community exists.',
    ],
  },
  {
    slug: 'preserving-adoption-files-photos-and-stories',
    title: 'Preserving adoption files, photos, and family stories',
    dek: 'The paperwork is aging, the photographs are fading, and the person who remembers is not getting younger. A practical guide to saving all three.',
    kind: 'explainer',
    ...ED,
    readingTime: 7,
    pullquote: 'The file may be wrong. Preserve it anyway — annotate, don’t discard.',
    art: 'arc',
    body: [
      'Somewhere in many adoptive families there is a box: an adoption decree, agency paperwork, a tiny photograph stapled to an intake form, a plane ticket, a name tag, sometimes letters. That box is often the only physical record of how your family came to exist, and it is quietly deteriorating. Preserving it is a concrete, useful thing a descendant can do — often more welcome than questions, and frequently the thing that starts the conversation anyway.',
      'First, permission. If the documents are your parent’s, the decision to scan, share, or even look at them is your parent’s. “Can I scan these so they are safe?” is itself a gentle way into the subject — most people say yes to preservation even when they are not ready to reminisce.',
      'What counts: more than you think. The obvious papers — decrees, agency correspondence, medical intake forms — but also photographs of the flight or the airport, luggage tags, clothing, letters from foster mothers, cassette tapes, anything with a name or a date on it. Do not throw away envelopes; postmarks are dates.',
      'Scanning, briefly: use 600 dpi for photographs and small documents, 300 dpi for ordinary paper. Save an untouched master (TIFF or PNG) plus an everyday JPEG copy. Scan both sides — the back of a Korean photograph often carries handwriting that matters more than the front. Do not crop, straighten, or “enhance” the master. Name files with what you know: 1985-holt-intake-front.tiff beats scan0031.tiff forever.',
      'Storage, briefly: paper and photos live longest somewhere cool, dry, and dark — a bedroom closet, not an attic or basement. Acid-free folders and sleeves are cheap online. Never laminate anything, and never use tape; both are one-way doors. For the digital copies, follow the 3-2-1 rule: three copies, two different kinds of storage, one somewhere else (cloud storage counts).',
      '> The person who remembers is a primary source too.',
      'Record the telling, not just the paper. A phone voice memo of your parent walking through the box — what is this, who gave it to you, what do you remember — will one day be worth more than the scans. You do not need equipment or interviewing skill. Ask small questions, let silences sit, stop when they want to stop. Twenty minutes is a triumph.',
      'One more thing, given the history: the file may be wrong. Korea’s truth commission confirmed in 2025 that many adoption records contain fabricated details — orphan registrations for children who had parents, altered names and birthdates. If your family’s paperwork contradicts your family’s memories, preserve both and write down the discrepancy. An annotated wrong document is evidence; a discarded one is gone. And make copies for relatives — redundancy across households is how family archives actually survive.',
    ],
  },
  {
    slug: 'visiting-korea-as-a-descendant',
    title: 'Visiting Korea as a descendant of an adoptee',
    dek: 'It is not quite a heritage trip and not quite a return. What to know before you book, from paperwork to the feelings nobody warns you about.',
    kind: 'explainer',
    ...ED,
    readingTime: 6,
    pullquote: 'You are allowed to go for your own reasons — including ones your parent does not share.',
    art: 'halftone',
    body: [
      'For most travellers, Korea is simply a fantastic trip. For a descendant of an adoptee it is also something else: the place your family’s story runs through, visited by someone who may be the first in the family to go back — or the second, standing next to a parent seeing it again. Both versions are worth doing, and both are easier with a little preparation.',
      'The practical part is genuinely easy. Korea is one of the most comfortable countries in the world to travel: safe, clean, superbly connected by trains and subways, and manageable in English in the major cities. Spring (April–May) and autumn (September–November) have the best weather. Check the current entry requirements for your passport before booking — they change — and budget as you would for any developed country. Seoul does not require a tour group; it barely requires a plan.',
      'Learn to read Hangul before you go. Not the language — the alphabet. Hangul was designed in the 1440s to be learnable, and a motivated beginner can read it phonetically after a weekend of practice. Being able to sound out a menu or a subway station transforms the trip, and for many descendants there is something quietly moving about reading the script your family once lived inside.',
      '> Being read as Korean, without the language, is its own strange experience. It helps to expect it.',
      'The emotional part deserves a paragraph of its own. Depending on how you look, you may be addressed in Korean everywhere you go and feel the odd grief of not understanding a word — or you may be read as a foreigner in the one country where you expected not to be. Walking past a hospital, an agency building, or just an ordinary neighbourhood knowing your family’s story passed through places like it can land harder than expected. None of this ruins the trip. It is simply worth knowing that a “vacation” to Korea often is not only that, and giving yourself room accordingly.',
      'If you want the adoption-specific layer, it exists. Adoptee-led organisations in Seoul — GOA’L is the best known — help with birth-family search and navigating Korea as someone connected to adoption. File reviews and record requests go through the National Center for the Rights of the Child; note that the legal right to request records belongs to the adoptee, so if the search interests your family, that part is your parent’s to initiate. Heritage tours designed for adoptee families run regularly, and the international adoptee Gatherings held in Seoul draw hundreds of adoptees and, increasingly, their children.',
      'And if you do not want the adoption-specific layer — skip all of it. Eating your way through Gwangjang Market, hiking Bukhansan, and coming home with skincare is a complete and legitimate way for a descendant to meet Korea. The connection does not have to be processed to be real. Go for your own reasons; they count.',
    ],
  },
  {
    slug: 'korean-words-for-family',
    title: 'The Korean words for family',
    dek: 'Korean kinship terms encode exactly how a relative is related to you. A working glossary for people meeting these words as adults.',
    kind: 'explainer',
    ...ED,
    readingTime: 5,
    pullquote: 'Korean has a word for exactly which relative someone is. Learning them is allowed, whoever you have to use them on.',
    art: 'grid',
    body: [
      'English gets by with a handful of family words — aunt, uncle, cousin, grandma. Korean is precise where English is vague: the word for a relative tells you which side of the family they are on, and often their position in it. For descendants of adoptees these words can carry an odd charge — a detailed map of a territory your family could not fully chart. Learning them anyway is worthwhile, and it is allowed.',
      'The everyday core: 엄마 (eomma) and 아빠 (appa) are mom and dad; 어머니 (eomeoni) and 아버지 (abeoji) the formal mother and father. 할머니 (halmeoni) is grandmother, 할아버지 (harabeoji) grandfather — with 외 (oe) in front, 외할머니 and 외할아버지, they mean specifically your mother’s parents. 가족 (gajok) is family.',
      'Aunts and uncles, by side: your mother’s sister is 이모 (imo); your father’s sister is 고모 (gomo); their husbands are 이모부 and 고모부. Your mother’s brother is 외삼촌 (oe-samchon); 삼촌 (samchon) is the general-purpose uncle. The word itself tells everyone at the table exactly how you are related — which is the charm and the point.',
      'Siblings depend on who is speaking: an older sister is 언니 (eonni) to a girl and 누나 (nuna) to a boy; an older brother is 오빠 (oppa) to a girl and 형 (hyeong) to a boy. A younger sibling of either kind is 동생 (dongsaeng). If you know any Korean words at all from dramas or K-pop, it is probably these.',
      '> 사촌 means “four degrees” — the word for cousin is literally a measurement of distance.',
      'The system underneath is called 촌수 (chonsu), counting degrees of kinship: one 촌 between parent and child, two between siblings, three to an aunt or uncle, four to a cousin — which is why cousin is 사촌 (sachon), “four chon”. It is a way of thinking about family as a lattice of exact distances, and once you see it, the vocabulary stops feeling arbitrary.',
      'A note for this community in particular: these words historically encode a bloodline-centred view of family — the 외 that marks the maternal side literally means “outside”. Adoption sits awkwardly in that older frame, and modern Korean families bend these words all the time: titles like 이모 are warmly used for close family friends who are no blood relation at all. Which means the vocabulary is more flexible than its history — and if there is a 할머니 in your family’s story, found or imagined, the word is yours to use. Pronunciations above are approximate; any language app or the resources on our Resources page will give you the sounds properly.',
    ],
  },
  {
    slug: 'feeling-connected-or-disconnected-from-korea',
    title: 'Feeling connected — or disconnected — from Korea',
    dek: 'Some descendants feel pulled toward Korea their whole lives. Some feel nothing. Most move around between the two. All of it is normal.',
    kind: 'explainer',
    ...ED,
    readingTime: 5,
    pullquote: 'Connection is allowed to be chosen, partial, and seasonal. So is distance.',
    art: 'cut',
    body: [
      'Ask a room of descendants how connected they feel to Korea and you will get every possible answer, often from the same person at different ages. It is worth saying plainly: there is no correct amount of connection for a DoKAD to feel, and both ends of the spectrum come with a story someone will recognise.',
      'Connection can arrive through a parent — kimchi in the fridge, a trip taken together, a shelf of books — or precisely through a parent’s silence, as the pull to understand what nobody would talk about. It can also arrive sideways: this generation grew up while Korean film, music, food, and television went global, which means many descendants first met Korea through the same dramas and groups their friends love. Meeting your family’s country as a worldwide pop-culture phenomenon is genuinely strange — a thing your history is tangled up in, arriving as everyone else’s entertainment — and it can open the door or make the whole subject feel oddly public.',
      '> “Not Korean enough” is a feeling, not a fact. Nobody is checking.',
      'Disconnection has its own textures. Some descendants feel nothing when Korea comes up and wonder if they should. Some tried — a class, a trip, an app — and it did not take. Mixed-race descendants sometimes describe feeling unentitled to a connection others assume they have, or assumed to lack one they actually feel. And some simply have fuller claims elsewhere: other heritages, other families, other stories that occupy the space. None of this is failure. An inheritance is not an obligation.',
      'If you want more connection, the doors are ordinary and low-stakes: cook one dish properly, learn to read Hangul in a weekend, watch the films made by adoptees themselves, come to one event and see how it sits. Interest is allowed to be an experiment. It is also allowed to be dropped and picked back up in ten years.',
      'And if you want less — if the subject exhausts you, or arrives loaded with family weight you did not choose — that is a legitimate settled answer, not a phase to be fixed. This community includes people at every distance from Korea, including people still deciding. The only position we push back on is the idea that someone else gets to grade your answer.',
    ],
  },
]

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug)
}

export function relatedStories(slug: string, count = 3) {
  const current = stories.find((s) => s.slug === slug)
  return stories
    .filter((s) => s.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.kind === current?.kind ? 0 : 1
      const bMatch = b.kind === current?.kind ? 0 : 1
      return aMatch - bMatch
    })
    .slice(0, count)
}
