import { definePage, items, line, paras, text } from '../fields'

export const storiesPage = definePage({
  id: 'stories',
  title: 'Stories',
  path: '/stories',
  help: 'The stories themselves are edited under Stories in the menu. This is the wording around them, on the Stories page and on each story’s page.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Stories'),
        description: text(
          'Description',
          'Essays, interviews, poems, photographs, and open questions from descendants of Korean adoptees.',
        ),
      },
    },
    hero: {
      title: 'Top of the Stories page',
      fields: {
        headline: line('Headline', 'Stories from the'),
        knockout: line('Headline, last words (white on black)', 'next generation'),
        lead: text(
          'Introduction',
          'Essays, interviews, poems, photographs, and open questions from descendants of Korean adoptees. Written by us, about us, on our own terms.',
        ),
        note: line('Handwritten note', 'anonymous is a real option →'),
      },
    },
    note: {
      title: 'Editor’s note',
      fields: {
        eyebrow: line('Small label', 'Editor’s note'),
        body: paras('Text', [
          '**The explainers and guides below are real** — researched and written by the DOKADS editorial team, with sources on our Resources page. What Issue 001 still needs is the part we will never write for you: personal stories from actual DoKADs.',
          'Essays, interviews, poems, photo stories — anonymous and pseudonymous both welcome. Submission details are at the bottom of this page.',
        ]),
      },
    },
    list: {
      title: 'The list of stories',
      help: 'The first featured story leads; order is set on each story.',
      fields: {
        featured: line('Section label: featured', 'Featured'),
        kicker: line('Section label: everything else', 'Everything else'),
        all: line('Filter: all', 'Everything'),
        one: line('Count: one', 'piece'),
        many: line('Count: several', 'pieces'),
        empty: text(
          'When a filter matches nothing',
          '**Nothing here yet.** This format is open — if you have one, it could be the first.',
        ),
      },
    },
    submit: {
      title: 'Tell us your story',
      fields: {
        kicker: line('Section label', 'Tell us your story'),
        headline: text('Headline', 'You do not have to be\na writer.'),
        body: paras('Text', [
          'Send four hundred words or four thousand. Send a poem, a voice memo, a scan of something from a box in your parents’ basement, or a question you have never asked out loud.',
          '**You choose how you are credited** — full name, first name only, a pseudonym, or anonymous. You can change that later, and you can withdraw a piece after it runs.',
          'If your piece names other people in your family, we will ask whether they know. Nothing about birth family, adoption records, or family relationships gets published without you saying so explicitly.',
        ]),
        cardTitle: line('Card: heading', 'Ways to be credited'),
        cardList: items(
          'Card: list',
          { lead: line('Bold start', ''), rest: line('Rest of the line', '') },
          [
            { lead: 'Full name', rest: '— the whole thing' },
            { lead: 'First name', rest: '— “By Nari”' },
            { lead: 'Pseudonym', rest: '— pick anything' },
            { lead: 'Anonymous', rest: '— no byline at all' },
          ],
          { itemTitle: 'lead', noun: 'line' },
        ),
        cta: line('Card: sticker', 'Pitch a story'),
        subject: line('Email subject for pitches', 'Story pitch for DOKADS'),
        note: line('Card: handwritten note', 'email us — a person reads it'),
      },
    },
    story: {
      title: 'Each story’s page',
      fields: {
        crumb: line('Breadcrumb', 'Stories'),
        credited: line('Before the credit style', 'credited as:'),
        artCaption: text(
          'Caption under the artwork',
          '**Above** — generated artwork. DOKADS does not use stock photography of Korean or mixed-race families, and does not use AI-generated people in place of real community members.',
        ),
        legalEyebrow: line(
          'Legal stories: label on the disclaimer box',
          'Educational information, not legal advice',
        ),
        reviewedBefore: line(
          'Legal stories: before the review date',
          'Last reviewed against official sources on',
        ),
        reviewedAfter: line(
          'Legal stories: after the review date',
          '. Rules change — check the sources at the end before acting on anything here.',
        ),
        placeholder: text(
          'Placeholder warning',
          '**Placeholder piece.** This is layout copy, not anyone’s real account.',
        ),
        sources: line('Sources heading', 'Sources'),
        footNote: line('Handwritten note', 'you can withdraw a piece at any time'),
        footStory: line('Sticker 1', 'Tell us your story'),
        footJoin: line('Sticker 2', 'Join DOKADS'),
        related: line('Section label: more stories', 'Read this next'),
      },
    },
  },
})
