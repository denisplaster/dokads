import { definePage, items, line, list, paras, text } from '../fields'
import { guidelines as base, GUIDELINES_CHECKBOX } from '../../data/community'

export const guidelinesPage = definePage({
  id: 'guidelines',
  title: 'Community guidelines',
  path: '/guidelines',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Community guidelines'),
        description: text(
          'Description',
          'Short, and mostly about not making anyone justify their own family.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'Community\nguidelines.'),
        lead: text(
          'Introduction',
          'Short, and mostly about not making anyone justify their own family. Everyone who registers for an event agrees to these.',
        ),
        note: line('Handwritten note', 'rules so nobody has to be brave to show up'),
      },
    },
    groups: {
      title: 'The guidelines',
      fields: {
        groups: items(
          'Groups',
          { title: line('Heading', ''), items: list('Guidelines', []) },
          base.map((g) => ({ title: g.title, items: [...g.items] })),
          { itemTitle: 'title', noun: 'group' },
        ),
      },
    },
    quote: {
      title: 'Quote',
      fields: {
        quote: text('Quote', 'Nobody here has to prove they belong.'),
        cite: line('Attribution', 'The short version'),
      },
    },
    harm: {
      title: 'If something goes wrong',
      fields: {
        kicker: line('Section label', 'If something goes wrong'),
        body: paras('Text', [
          'Harm gets addressed directly and privately first. That means talking to the people involved, being specific about what happened, and agreeing what changes — not a public pile-on, and not pretending it did not happen.',
          'Organisers can ask someone to step back from a gathering. Repeated or serious harm means being asked not to come back.',
          'If you are the person who was harmed, you decide how much you want to be involved in sorting it out. Reporting something does not commit you to a process.',
        ]),
        cardTitle: line('Card: heading', 'At registration'),
        checkbox: line('Card: the agreement checkbox', GUIDELINES_CHECKBOX),
        cardBody: text(
          'Card: text',
          'This box appears on every event registration form and on the join form. It is the only mandatory tick on either.',
        ),
        ctaEvents: line('Card: button', 'See events'),
        ctaAbout: line('Card: sticker', 'About DOKADS'),
      },
    },
  },
})
