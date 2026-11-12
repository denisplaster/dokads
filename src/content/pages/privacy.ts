import { definePage, line, paras, text } from '../fields'

export const privacy = definePage({
  id: 'privacy',
  title: 'Privacy',
  path: '/privacy',
  help: 'This is the version shown while the site collects nothing from visitors (no forms). Rewrite it before any form goes live.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Privacy'),
        description: text(
          'Description',
          'What we ask for, what we do with it, and how to delete it. Share only what feels comfortable.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'Privacy,\nplainly.'),
        lead: text(
          'Introduction',
          'This site does not collect anything about you. No account, no forms, no tracking.',
        ),
        status: text(
          'Status box',
          '**Status:** DOKADS is currently an informational site only. There are no forms, no sign-ups, and no accounts — nothing on this website collects or stores anything about you. The rest of this page says what that means, and what will change if that ever does. Last reviewed October 2026.',
        ),
      },
    },
    body: {
      title: 'The sections',
      fields: {
        s1: line('Section 1 heading', 'What this site collects'),
        s1Body: paras('Section 1 text', [
          'Nothing. There is no sign-up form, no registration form, no comment box, and no account to create. We run no analytics, set no tracking cookies, and embed nothing from advertising networks. You can read every page here without telling us anything at all, and without us knowing you did.',
          'The fonts are served from this site rather than a font provider, so loading a page does not report your visit to anyone else either.',
        ]),
        s2: line('Section 2 heading', 'If you email us'),
        s2Body: paras('Section 2 text', [
          'Several pages invite you to write to [dokads@akconnection.com](mailto:dokads@akconnection.com). That is ordinary email — it reaches a mailbox a person reads, and it is handled like any other message, not fed into a database or a mailing list. Ask us to delete your message and that is the end of it, with no form and no reason needed.',
          'Please send only what you are comfortable having in an inbox. You never need to share adoption records, birth-family information, or documentation of anyone’s family history to take part in anything here.',
        ]),
        s3: line('Section 3 heading', 'If you are under 18'),
        s3Body: paras('Section 3 text', [
          'Nothing on this site asks your age, because nothing on this site collects anything. If you email us and tell us you are under 18, we will not add you to any directory, research list, or unrestricted group, and some events will ask for a parent or guardian to say yes first.',
        ]),
        s4: line('Section 4 heading', 'Other people’s platforms'),
        s4Body: paras('Section 4 text', [
          'Links out to other organisations, bookshops, podcasts and social platforms go to sites with their own privacy terms and their own data collection, not ours. Once you follow a link, you are under their rules rather than this page.',
        ]),
        s5: line('Section 5 heading', 'Stories and photographs'),
        s5Body: paras('Section 5 text', [
          'Contributors choose their own byline — full name, first name, pseudonym, or anonymous — and can change it or withdraw a piece later. Nothing about birth family, adoption records, or family relationships gets published without explicit agreement. At events, we ask before photographing or identifying anyone.',
        ]),
        s6: line('Section 6 heading', 'If this changes'),
        s6Body: paras('Section 6 text', [
          'When sign-ups open, this page will be rewritten before a single form goes live — not after — and will say exactly what is asked for, what it is used for, and how to have it deleted. Until you see that, assume this site knows nothing about you, because it does not.',
        ]),
        foot: text(
          'Last line',
          'Questions about any of this? Write to [dokads@akconnection.com](mailto:dokads@akconnection.com) — or read the [community guidelines](/guidelines), which cover how we handle personal information at gatherings.',
        ),
      },
    },
  },
})
