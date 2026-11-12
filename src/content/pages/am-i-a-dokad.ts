import { definePage, items, line, list, paras, text } from '../fields'

export const amIaDokad = definePage({
  id: 'am-i-a-dokad',
  title: 'Am I a DoKAD?',
  path: '/am-i-a-dokad',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Am I a DoKAD?'),
        description: text(
          'Description',
          'A DoKAD is a descendant of a Korean adoptee. If your parent or grandparent was adopted from Korea, that is you. No test to pass.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: line('Headline', 'Am I a'),
        knockout: line('Headline, last word (white on black)', 'DoKAD?'),
        lead: text(
          'Introduction',
          'Probably a fair question, since most people have never heard the word. Here is the whole thing in about thirty seconds.',
        ),
        note: line('Handwritten note', 'no test. no proof. no forms about your family.'),
      },
    },
    short: {
      title: 'The short version',
      help: 'Shown next to the “What is a DoKAD?” card, which is edited under Site-wide text.',
      fields: {
        kicker: line('Section label', 'The short version'),
        body: paras('Text', [
          'A DoKAD is a **descendant of a Korean adoptee**. If your parent or your grandparent was adopted from Korea, you are one.',
          'That is the entire definition. It does not depend on whether you speak Korean, whether you have been to Korea, whether people read you as Korean, whether you are mixed race, whether you know anything about your family before the adoption, or whether you have ever thought about any of this before today.',
          'Some people use the word about themselves straight away. Some never use it and just come to things. Both are completely normal.',
        ]),
      },
    },
    tree: {
      title: 'The family diagram',
      fields: {
        kicker: line('Section label', 'Where you might sit'),
        rows: items(
          'Rows',
          {
            label: line('Label', ''),
            sub: line('Small line under the label', ''),
            detail: text('Shown when the row is opened', ''),
          },
          [
            {
              label: 'Korean birth family',
              sub: 'In Korea',
              detail:
                'Sometimes known, more often not. Many adoptees have little or no information here, and many DoKADs grow up with this part of the tree simply blank.',
            },
            {
              label: 'Korean adoptee',
              sub: 'Adopted from Korea, raised abroad',
              detail:
                'Your parent or grandparent. Roughly 200,000 people were adopted out of Korea from the 1950s onward — most to the United States and Western Europe.',
            },
            {
              label: 'Child of a Korean adoptee',
              sub: 'This is a DoKAD',
              detail:
                'If your mother or father was adopted from Korea, this is you. It is the most common way into this community.',
            },
            {
              label: 'Grandchild of a Korean adoptee',
              sub: 'Also a DoKAD',
              detail:
                'If your grandparent was adopted from Korea, this is you too. The generation gap does not disqualify anyone.',
            },
            {
              label: 'Later descendants',
              sub: 'Still DoKADs',
              detail:
                'Great-grandchildren and onward. The history keeps travelling, and so does the invitation.',
            },
          ],
          { fixed: true, itemTitle: 'label', noun: 'row' },
        ),
        flag: line('Tag on the “could be you” rows', 'could be you'),
        caveat: text(
          'Note under the diagram',
          '**This diagram is simplified.** Real families are messier than five boxes in a column — step-families, adoptions in more than one generation, relatives who are not on any paperwork, people raised by someone other than a parent. If the shape of your family is not on here, that does not mean you are not.',
        ),
      },
    },
    check: {
      title: 'The checklist',
      fields: {
        kicker: line('Section label', 'Try it against your own family'),
        legend: line('Instruction', 'Tick anything that sounds like you'),
        examples: list('Checklist', [
          'My mother was adopted from Korea',
          'My father was adopted from Korea',
          'One or both of my parents are Korean adoptees',
          'My grandparent was adopted from Korea',
          'More than one person in my family was adopted from Korea',
        ]),
        soft: line(
          'Last option (shown lighter)',
          'I am still figuring out how this history relates to me',
        ),
        waiting: line('Before anything is ticked', 'pick as many as you like — or none'),
        yesHead: line('Answer: headline', 'Then yes — that’s you.'),
        yesBody: text(
          'Answer: text',
          'You are a descendant of a Korean adoptee — a DoKAD, if you want the word. You do not have to use the term, identify with it, feel any particular way about Korea, or know anything about your family history to take part.',
        ),
        softHead: line('Answer when only the last option is ticked: headline', 'That counts too.'),
        softBody: text(
          'Answer when only the last option is ticked: text',
          'Plenty of people show up here without a clear sense of whether it applies to them, or how much they want it to. You do not have to resolve that before joining anything. Come and be uncertain in company.',
        ),
        ctaJoin: line('Answer: button 1', 'Join DOKADS'),
        ctaEvents: line('Answer: button 2', 'See what’s coming up'),
      },
    },
    close: {
      title: 'Bottom of the page',
      fields: {
        headline: text(
          'Headline',
          'There is no test you need to pass and no single way to identify as a DoKAD.',
        ),
        lead: text(
          'Text',
          'Come as you are, including unsure. You can read everything here without telling us anything about yourself.',
        ),
        ctaStart: line('Button 1', 'Start here'),
        ctaJoin: line('Button 2', 'Join DOKADS'),
        ctaShare: line('Button 3', 'Send this to someone'),
        stickers: list('Stickers', ['Print it', 'Share it', 'QR it']),
        print: text(
          'Printing note',
          'This page is built to work as a handout too — use your browser’s print option for a clean one-page version, or grab the assets on the [Share DOKADS](/share) page.',
        ),
      },
    },
  },
})
