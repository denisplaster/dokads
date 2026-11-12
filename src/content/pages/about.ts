import { definePage, items, line, list, paras, text } from '../fields'

export const about = definePage({
  id: 'about',
  title: 'About',
  path: '/about',
  help: 'The community-led principle itself is edited under “Site-wide text”.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'About'),
        description: text(
          'Description',
          'DOKADS is community-led: DoKAD programming should be shaped and led by DoKADs.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'About\nDOKADS.'),
        lead: text(
          'Introduction',
          'A community and learning hub for children, grandchildren, and other descendants of Korean adoptees — built by descendants, for descendants.',
        ),
      },
    },
    positioning: {
      title: 'Three connected things',
      fields: {
        kicker: line('Section label', 'Three connected things'),
        cards: items(
          'Cards',
          { title: line('Title', ''), body: text('Text', '') },
          [
            {
              title: 'An introduction',
              body: 'Help people understand the term and recognise whether the community may include them. Most visitors arrive having never seen the word.',
            },
            {
              title: 'A resource',
              body: 'Clear, respectful information about identity, family, Korea, adoption, culture, and what travels between generations.',
            },
            {
              title: 'A connection point',
              body: 'Events, local groups, stories, and ways to take part — so the questions get asked in company rather than alone.',
            },
          ],
          { fixed: true, itemTitle: 'title', noun: 'card' },
        ),
      },
    },
    principle: {
      title: 'Community-led',
      fields: {
        kicker: line('Section label', 'Community-led, and we mean it'),
        note: line('Handwritten note', 'with, not on behalf of.'),
        caption: text(
          'Caption by the picture',
          '**Where it applies** — this principle governs the About page, community values, volunteer and committee roles, event planning, and any future regional-group guidelines.',
        ),
      },
    },
    assume: {
      title: 'What we do not assume',
      fields: {
        kicker: line('Section label', 'What we do not assume'),
        lead: text(
          'Introduction',
          'The fastest way to make someone feel like they do not belong is to describe an experience they do not recognise. So we try not to assume:',
        ),
        list: list('The list', [
          'that everyone feels affected by adoption',
          'that every DoKAD wants a connection to Korea',
          'that everyone has access to adoption records',
          'that everyone has a good relationship with their adoptee parent',
          'that everyone identifies as Korean',
          'that every DoKAD is mixed race',
          'that anyone wants to discuss trauma',
          'that DoKAD is a diagnosis, a requirement, or a fixed category',
        ]),
        foot: text(
          'After the list',
          '**There is no single DoKAD experience.** If something on this site reads as though there is, tell us and we will fix the wording.',
        ),
      },
    },
    partners: {
      title: 'Adoptees, parents, and partners',
      fields: {
        kicker: line('Section label', 'Adoptees, parents, and partners'),
        body: paras('Text', [
          'Korean adoptees built the organisations, the writing, the research, and the language that this community stands on. Nothing here replaces adoptee-led work, and adoptee voices remain central to any conversation about Korean adoption.',
          'Descendants also have questions of their own — about a parent’s history, about race, about a family tree that stops — and those questions deserve a place that is built around them.',
          'DOKADS is powered by [AK Connection](https://www.akconnection.com), the Minnesota-based community organisation for adult Korean adoptees — support that looks exactly like the principle above: adoptees backing the next generation’s space without directing it. Other organisations, researchers, and allies are welcome to support, fund, mentor, and partner, and **being part of DOKADS does not connect you to any other organisation**.',
        ]),
        cardTitle: line('Card: heading', 'Where this started'),
        cardBody: text(
          'Card: text',
          'DOKADS began with a survey of descendants of Korean adoptees. The findings shape the site you are reading: plain language before jargon, social gatherings before programming, coffee shops before bars, and a first local community in Minnesota with everything else built for a wider audience.',
        ),
        cardRegion: line('Card: button 1', 'Minnesota DoKADs'),
        cardGuidelines: line('Card: button 2', 'Community guidelines'),
      },
    },
    close: {
      title: 'Bottom of the page',
      fields: {
        headline: text('Headline', 'Want a say in what this becomes?'),
        lead: text('Text', 'That is not a rhetorical question — it is the whole model.'),
        cta: line('Button', 'Join DOKADS'),
        sticker: line('Sticker', 'Share it with someone'),
      },
    },
  },
})
