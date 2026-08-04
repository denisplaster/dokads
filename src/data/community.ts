/** Community guidelines, values, and the community-led principle. */

export const COMMUNITY_LED_PRINCIPLE = {
  headline: 'DoKAD programming should be shaped and led by DoKADs.',
  body: 'Korean adoptees, parents, organizations, researchers, and allies may provide support, resources, mentorship, funding, or partnership — but descendants should have meaningful leadership in decisions about DoKAD programming.',
  about:
    'DOKADS recognizes that the Korean adoptee community made this generation possible and that adoptee voices remain central to conversations about Korean adoption. At the same time, descendants have experiences and questions of their own. DoKAD programs should be developed with DoKAD leadership rather than created solely on their behalf.',
}

export type GuidelineGroup = {
  number: string
  title: string
  tone: string
  items: string[]
}

export const guidelines: GuidelineGroup[] = [
  {
    number: '01',
    title: 'Everyone arrives from somewhere different',
    tone: 'yellow',
    items: [
      'Respect that people have different relationships to adoption and to Korea.',
      'Do not assume all DoKADs feel the same way about any of it.',
      'Do not question whether someone is “Korean enough.”',
      'Let people take part without having all the language or all the answers.',
    ],
  },
  {
    number: '02',
    title: 'Family history is nobody’s to demand',
    tone: 'blue',
    items: [
      'Do not pressure anyone to share personal family history.',
      'Protect information about birth family, adoption records, and family relationships.',
      'Do not share another person’s story outside the group without their consent.',
      'Avoid speaking on behalf of adoptees or on behalf of other DoKADs.',
    ],
  },
  {
    number: '03',
    title: 'Consent in the room',
    tone: 'pink',
    items: [
      'Ask permission before photographing or identifying attendees.',
      'Respect names, pronouns, family structures, and racial identities.',
      'Check before bringing someone who was not invited to a closed gathering.',
    ],
  },
  {
    number: '04',
    title: 'Room for all of it',
    tone: 'green',
    items: [
      'Make room for joy, uncertainty, grief, humour, curiosity, and disagreement.',
      'You do not have to be sad here, and you do not have to be fine here.',
      'Address harm directly, without public shaming or harassment.',
    ],
  },
]

export const GUIDELINES_CHECKBOX = 'I agree to follow the DOKADS community guidelines.'

/** Tone bank — phrases the site reuses so the voice stays consistent. */
export const REASSURANCES = [
  'Never heard the word DoKAD before? You are not alone.',
  'Still figuring out whether this describes you? That is okay.',
  'You do not need to know your full family history to take part.',
  'There is no single DoKAD experience.',
  'Your parent’s story and your story can be connected without being identical.',
  'Come meet people who may be asking some of the same questions.',
  'Start with curiosity.',
  'Share only what feels comfortable.',
]
