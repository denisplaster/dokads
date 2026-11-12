import { definePage, line, paras, text } from '../fields'

export const resourcesPage = definePage({
  id: 'resources',
  title: 'Resources',
  path: '/resources',
  help: 'The resources themselves are edited under Resources in the menu; shelf names are under “Labels and statuses”.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Resources'),
        description: text(
          'Description',
          'A community-built reading pile: books, films, podcasts, organisations, and the practical things nobody hands you.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'The reading\npile.'),
        lead: text(
          'Introduction',
          'Not a database — a set of shelves the community fills in. Books, films, podcasts, organisations, and the practical stuff nobody hands you.',
        ),
        note: line('Handwritten note', 'recommend something ↓'),
      },
    },
    note: {
      title: 'How this list works',
      fields: {
        eyebrow: line('Small label', 'How this list works'),
        body: paras('Text', [
          '**Everything named below is real** — books and films you can find at a library or bookshop, and organisations whose links go where they claim. Shelves marked *open call* are ones we are honestly still collecting for; the suggestion form below keeps this page growing.',
          'Anything about immigration, citizenship, visas, or law gets checked and dated before it goes up — see how we handle that on [the learn page](/learn#topics).',
        ]),
      },
    },
    list: {
      title: 'The shelves',
      fields: {
        kicker: line('Section label', 'Browse the shelves'),
        format: line('Filter: format', 'Format'),
        formatAll: line('Filter: all formats', 'Everything'),
        who: line('Filter: who for', 'Who for'),
        whoAll: line('Filter: anyone', 'Anyone'),
        one: line('Count: one', 'shelf'),
        many: line('Count: several', 'shelves'),
        visit: line('Link on resources with a website', 'Visit ↗'),
        listed: line('Books and films without a link', 'Library · bookshop'),
        openCall: line('Shelves still being filled', 'Open call'),
      },
    },
    suggest: {
      title: 'Suggest something',
      fields: {
        kicker: line('Section label', 'Suggest something'),
        headline: text('Headline', 'What got you\nthrough?'),
        body: paras('Text', [
          'A book, a film, a podcast episode, an organisation, a single blog post from 2011. If it helped you understand your family, your parent, Korea, or yourself, it belongs on a shelf here.',
          'Tell us which shelf, what it is, and one line on why. We will credit you or not, whichever you prefer.',
        ]),
        cta: line('Button', 'Send a recommendation'),
        subject: line('Email subject', 'Resource suggestion for DOKADS'),
      },
    },
  },
})
