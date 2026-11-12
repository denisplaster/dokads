import { definePage, items, line, text } from '../fields'

export const start = definePage({
  id: 'start',
  title: 'Start here',
  path: '/start',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Start here'),
        description: text(
          'Description',
          'Six ways into DOKADS. Pick whichever one sounds most like you today — there is no correct order.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'Start\nhere.'),
        lead: text(
          'Introduction',
          'There is no correct order and nothing you have to read first. Pick whichever of these sounds most like you today.',
        ),
        note: line('Handwritten note', 'you can also just poke around. that’s allowed.'),
      },
    },
    word: {
      title: 'One word, up front',
      help: 'The phrases listed under it are the first five “Reassurances” in Site-wide text.',
      fields: {
        kicker: line('Section label', 'One word, up front'),
        body: text(
          'Text',
          'You will see the term **DoKAD** across this site. It is shorthand, not a club. Nobody is going to ask you to prove anything, and nobody is going to mind if you never use the word about yourself.',
        ),
      },
    },
    routes: {
      title: 'Six ways in',
      fields: {
        kicker: line('Section label', 'Six ways in'),
        cards: items(
          'Cards',
          {
            title: line('Title', ''),
            body: text('Text', ''),
            cta: line('Button', ''),
            note: line('Handwritten note (optional)', ''),
          },
          [
            {
              title: 'I have never heard the word DoKAD',
              body: 'Start with the definition and the family diagram. Five minutes, no commitment, nothing to fill in.',
              cta: 'Am I a DoKAD?',
              note: 'most people start here',
            },
            {
              title: 'I want to understand the history',
              body: 'The background on Korean adoption that most of us were never given — plus the specific reasons descendants experience it differently.',
              cta: 'Learn the background',
              note: '',
            },
            {
              title: 'I want to meet people like me',
              body: 'Coffee meetups, online gatherings, and guided conversations. Small, free, and mostly informal.',
              cta: 'See meetups',
              note: 'the point, really',
            },
            {
              title: 'I want to read other people’s stories',
              body: 'Essays, interviews, poems, and photo stories from descendants. Anonymous and pseudonymous contributions welcome.',
              cta: 'Read stories',
              note: '',
            },
            {
              title: 'My parent was adopted and I want to talk to them about it',
              body: 'One of the most common reasons people arrive here. There is a topic queue on exactly this, and a guided discussion in the works.',
              cta: 'Family + conversations',
              note: '',
            },
            {
              title: 'I am a parent, an adoptee, or an ally',
              body: 'You are welcome. Read how we think about who leads DoKAD programming, and what support looks like.',
              cta: 'About DOKADS',
              note: '',
            },
          ],
          {
            fixed: true,
            itemTitle: 'title',
            noun: 'card',
            help: 'Each card links to a fixed page: Am I a DoKAD?, Learn, Events, Stories, Learn (family), About.',
          },
        ),
      },
    },
    quote: {
      title: 'Quote',
      fields: {
        quote: text('Quote', 'Your parent’s story and your story can be connected without being identical.'),
        cite: line('Attribution', 'Read this if you read nothing else'),
      },
    },
    close: {
      title: 'Bottom of the page',
      fields: {
        headline: text('Headline', 'Ready when you are.'),
        lead: text(
          'Text',
          'Joining takes about a minute and tells us what to actually build. Most of it is optional.',
        ),
        cta: line('Button', 'Join DOKADS'),
        sticker: line('Sticker', 'Community guidelines'),
      },
    },
  },
})
