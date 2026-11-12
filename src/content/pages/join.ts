import { definePage, items, line, paras, text } from '../fields'

export const join = definePage({
  id: 'join',
  title: 'Join',
  path: '/join',
  help: 'While sign-ups are closed, this page explains how to get in touch instead of showing a form.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Join DOKADS'),
        description: text(
          'Description',
          'Sign-ups are not open yet. Read everything here, and email us if you want to hear when something starts.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'Want in? Email us.'),
        lead: text(
          'Introduction',
          'Sign-ups are not open yet. Until they are, the whole site is here to read — and the fastest way to hear when something starts is simply to send us a note.',
        ),
        note: line('Handwritten note', 'no form, no account, no newsletter machine'),
        emailLabel: line('Email button (the address is added after it)', 'Email'),
        emailSubject: line('Subject line of the email', 'I’d like to hear about DOKADS'),
        amI: line('Second button', 'Am I a DoKAD?'),
      },
    },
    now: {
      title: 'What there is to do right now',
      fields: {
        kicker: line('Section label', 'What there is to do right now'),
        cards: items(
          'Cards',
          { title: line('Title', ''), body: text('Text', ''), cta: line('Button', '') },
          [
            {
              title: 'Read the explainers',
              body: 'A short history of Korean adoption, what the term means, why descendants experience it differently, and how to talk to an adoptee parent about it.',
              cta: 'Read stories',
            },
            {
              title: 'Take the reading pile',
              body: 'Memoirs, documentaries, podcasts, and the adoptee-led organisations that have been doing this work far longer than we have.',
              cta: 'Open resources',
            },
            {
              title: 'Meetups',
              body: 'The first DoKAD meetup happened in Edina in September. Nothing new is scheduled yet — email us if you want to hear the moment something is.',
              cta: 'See events',
            },
          ],
          {
            fixed: true,
            itemTitle: 'title',
            noun: 'card',
            help: 'The buttons go to Stories, Resources and Events.',
          },
        ),
      },
    },
    promise: {
      title: 'When sign-ups do open',
      help: 'The phrases under the text are the first four “Reassurances” in Site-wide text.',
      fields: {
        kicker: line('Section label', 'When sign-ups do open'),
        body: paras('Text', [
          'It will be a few short questions — what connects you to Korean adoption, what you would like this community to run, and when you could actually come. Nothing harder than that, and most of it optional.',
          '**The first question will never be “do you identify as a DoKAD?”** It will be “was your parent or grandparent adopted from Korea?” — because plenty of people belong here long before they would use the word about themselves.',
        ]),
        cardTitle: line('Card: heading', 'What we are not doing'),
        cardList: items(
          'Card: list',
          { lead: line('Bold start', ''), rest: line('Rest of the line', '') },
          [
            { lead: 'No account.', rest: 'Nothing to sign up for or log into.' },
            { lead: 'No tracking.', rest: 'No analytics, no pixels, no cookies.' },
            { lead: 'No list.', rest: 'We are not storing anything about you at all.' },
            { lead: 'No newsletter.', rest: 'If you email us, a person reads it.' },
          ],
          { itemTitle: 'lead', noun: 'line' },
        ),
        cardCta: line('Card: sticker', 'Read the privacy page'),
      },
    },
    close: {
      title: 'Bottom of the page',
      fields: {
        headline: text('Headline', 'You do not need to have everything figured out to say hello.'),
        lead: text(
          'Text',
          'Tell us as much or as little as you want. Share only what feels comfortable.',
        ),
        sticker: line('Sticker', 'Community guidelines'),
      },
    },
  },
})
