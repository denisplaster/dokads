import type { CollageVariant } from '../lib/collage'
import type { Tone } from '../components/zine/ZineSection'

/** The four educational panels: WHO / WHAT / WHERE / WHY. */
export type Pillar = {
  id: 'who' | 'what' | 'where' | 'why'
  number: string
  word: string
  question: string
  dek: string
  tone: Tone
  art: CollageVariant
  note: string
  /** short bullets shown on the panel */
  points: string[]
  /** longer copy for the Learn page */
  body: string[]
}

export const pillars: Pillar[] = [
  {
    id: 'who',
    number: '01',
    word: 'Who',
    question: 'Who is a DoKAD?',
    dek: 'Children, grandchildren, and great-grandchildren of people adopted from Korea.',
    tone: 'blue',
    art: 'stack',
    note: 'no qualifying test →',
    points: [
      'Second generation and beyond',
      'Any racial background',
      'Any level of Korean connection',
      'Adopted parent, adopted grandparent, or further back',
    ],
    body: [
      'A DoKAD is a descendant of a Korean adoptee — most often the child of someone adopted from Korea, sometimes the grandchild or great-grandchild.',
      'That is the whole definition. It does not require speaking Korean, having visited Korea, being read as Korean, or knowing anything about your family’s history before the adoption. Plenty of DoKADs are mixed race. Plenty grew up in towns where nobody else looked like them, and plenty grew up somewhere it was never remarked on at all.',
      'It also does not require having a settled relationship with any of it. People arrive here curious, angry, indifferent, homesick for a place they have never been, or just looking for someone with the same weird set of facts. All of that counts.',
    ],
  },
  {
    id: 'what',
    number: '02',
    word: 'What',
    question: 'What is Korean adoption?',
    dek: 'Around 200,000 children adopted out of Korea since the 1950s — and what came after.',
    tone: 'yellow',
    art: 'grid',
    note: 'the part nobody taught us',
    points: [
      'Began in the 1950s',
      'Largest programme of its kind',
      'Mostly to the US and Europe',
      'The first generation are adults now',
    ],
    body: [
      'From the 1950s onward, roughly 200,000 children were adopted out of South Korea — the largest and longest-running international adoption programme in the world. Most went to families in the United States, and many to Western Europe and Australia.',
      'The reasons shifted decade to decade: war and its aftermath, poverty, the treatment of mixed-race children, the stigma attached to unmarried mothers, and a set of policies and agencies that made sending children abroad the path of least resistance. Korea has since tightened its adoption laws considerably, and adoptees themselves drove much of that change.',
      'What matters for this site is the part that comes next. The first generation are adults now. Many are parents. The questions did not end with them — they moved.',
    ],
  },
  {
    id: 'where',
    number: '03',
    word: 'Where',
    question: 'Where are we?',
    dek: 'Everywhere the programme sent people — and increasingly, back and forth.',
    tone: 'green',
    art: 'arc',
    note: 'add your city ↗',
    points: [
      'United States',
      'Denmark, Norway, Sweden, Netherlands',
      'France, Belgium, Germany',
      'Australia · Canada · and back in Korea',
    ],
    body: [
      'Korean adoptees were placed across the United States, Scandinavia, Western Europe, Canada, and Australia — which means their descendants are scattered the same way. A DoKAD in Copenhagen and a DoKAD in Minneapolis often have more in common with each other than with anyone in their own postcode.',
      'There is also a steady flow in the other direction. Adoptees have returned to Korea to live, work, search, and organise, and some DoKADs have grown up partly there.',
      'Geography is one of the harder parts of this community. We are small numbers spread very thin. That is most of why this exists online.',
    ],
  },
  {
    id: 'why',
    number: '04',
    word: 'Why',
    question: 'Why does this matter?',
    dek: 'Because the questions travel — and the second generation is having them alone.',
    tone: 'red',
    art: 'halftone',
    note: 'you are not the only one',
    points: [
      'Inherited, half-answered histories',
      'Race without cultural inheritance',
      'Family trees with a hard stop',
      'Nobody at school gets it',
    ],
    body: [
      'A lot of DoKADs grow up holding a story they did not live through and cannot verify. The family tree has a hard stop. The medical history is blank. Someone at school assigns a heritage project and it lands badly, and there is no good short answer to give the teacher.',
      'Some carry visible Korean ancestry without the cultural inheritance that people expect to come with it. Some carry none of the visibility and all of the connection. Some are close to a parent who does not want to talk about it, and some are close to a parent who cannot stop.',
      'None of that is a crisis and none of it needs fixing. But it is real, and it is much easier in company than alone. That is the entire premise of DOKADS.',
    ],
  },
]

export function getPillar(id: string) {
  return pillars.find((p) => p.id === id)
}
