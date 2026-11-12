import { definePage, line, list, text } from '../fields'

export const home = definePage({
  id: 'home',
  title: 'Homepage',
  path: '/',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        description: text(
          'Description',
          'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        eyebrow: line('Line above the headline', 'Your family’s adoption story may be part of your story too.'),
        premise: line(
          'Headline, first part',
          'Your parent or grandparent was ==adopted from Korea==.',
          { help: 'Words between ==double equals signs== get the highlighter.' },
        ),
        ask: line('Headline, second part', 'So, what does that mean for you?'),
        lead: text(
          'Introduction',
          'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees. Come explore the questions, stories, cultures, relationships, and identities that can continue across generations.',
        ),
        ctaStart: line('Button 1 (Start here)', 'Start here'),
        ctaAmI: line('Button 2 (Am I a DoKAD?)', 'Am I a DoKAD?'),
        ctaEvents: line('Button 3 (Events)', 'Meet other DoKADs'),
        note: line('Handwritten note', 'Never heard the word DoKAD before? You’re not alone.'),
        rotating: list('Rotating phrases (top right)', [
          'Identity is inherited, discovered, and created.',
          'Our parents’ stories are part of ours — but not all of ours.',
          'There is no single way to be a DoKAD.',
          'A new generation is joining the conversation.',
        ]),
        marquee: list('Scrolling banner', [
          'Descendants of Korean adoptees',
          'Issue 001',
          'Start with curiosity',
          'You belong in the conversation',
          'Minnesota + everywhere else',
        ]),
      },
    },
    teaser: {
      title: 'The first question',
      fields: {
        kicker: line('Section label', 'The first question'),
        headline: text('Headline', 'Was your parent or grandparent\nadopted from Korea?'),
        lead: text(
          'Text',
          'That is the only question that matters to start. If the answer is yes — or probably, or you think so but nobody has ever really explained it — you are in the right place.',
        ),
        cta: line('Button', 'Walk me through it'),
        note: line('Handwritten note', 'takes 30 seconds'),
        examples: list('Checklist', [
          'My mother was adopted from Korea',
          'My father was adopted from Korea',
          'One or both of my parents are Korean adoptees',
          'My grandparent was adopted from Korea',
          'More than one person in my family was adopted from Korea',
        ]),
        softExample: line(
          'Last checklist line (shown lighter)',
          'I am still figuring out how this history relates to me',
        ),
        foot: line('Under the checklist', 'Any of these? **Then yes.**'),
      },
    },
    pillars: {
      title: 'Who, what, where and why',
      help: 'The four panels themselves are edited under “Who / What / Where / Why”.',
      fields: {
        kicker: line('Section label', 'Who, what, where and why'),
        intro: line(
          'Introduction',
          'Four ways into the same subject. Take them in any order — or take one and leave.',
        ),
        link: line('Link on each panel', 'Read the long version'),
      },
    },
    stories: {
      title: 'Stories',
      fields: {
        kicker: line('Section label', 'Stories from the next generation'),
        cta: line('Button', 'Read all stories'),
        note: line('Handwritten note', 'got one of your own? →'),
        sticker: line('Sticker', 'Tell us your story'),
      },
    },
    quote: {
      title: 'Quote',
      fields: {
        quote: text('Quote', 'You do not need to have everything figured out before taking part.'),
        cite: line('Attribution', 'A community principle, not a slogan'),
      },
    },
    events: {
      title: 'Meetups',
      fields: {
        kickerUpcoming: line('Section label (something scheduled)', 'Coming up'),
        kickerNone: line('Section label (nothing scheduled)', 'Meetups'),
        headline: text('Headline', 'Come and meet\nsome people'),
        leadUpcoming: text(
          'Text (something scheduled)',
          'Small gatherings, mostly free, mostly informal. Coffee shops and video calls rather than conference rooms.',
        ),
        leadNone: text(
          'Text (nothing scheduled)',
          'The first DoKAD meetup has happened. Nothing new is on the calendar yet — when there is, it goes here first.',
        ),
        emptyHead: line('Card heading (nothing scheduled)', 'Want the next one?'),
        emptyBody: text(
          'Card text (nothing scheduled)',
          'Tell us you are interested and what would suit you — a time, a place, a kind of gathering. The first one happened because people asked.',
        ),
        emptyCta: line('Card button (nothing scheduled)', 'Email us'),
        emptySubject: line('Email subject for that button', 'Interested in the next DoKAD meetup'),
        all: line('Button: all events', 'All events'),
        region: line('Button: Minnesota', 'Minnesota DoKADs'),
      },
    },
    principle: {
      title: 'Community-led',
      help: 'The principle itself is edited under “Site-wide text”.',
      fields: {
        eyebrow: line('Small label', 'Our one non-negotiable'),
        about: line('Button: About', 'About DOKADS'),
        guidelines: line('Button: Guidelines', 'Community guidelines'),
        note: line('Handwritten note', 'adoptees made this generation possible. we know.'),
      },
    },
    join: {
      title: 'Join',
      fields: {
        eyebrow: line('Small label', 'Last thing'),
        headline: text('Headline', 'You belong in\nthe conversation.'),
        lead: text(
          'Text',
          'A few quick questions — nothing too personal. It helps us work out what to run, where, and when.',
        ),
        cta: line('Button: Join', 'Join DOKADS'),
        share: line('Button: Share', 'Share it with someone'),
        stickers: list('Stickers', ['Free', 'All ages', 'No experience required', 'Leave whenever']),
      },
    },
  },
})
