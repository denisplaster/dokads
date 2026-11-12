import { definePage, line, paras, text } from '../fields'

export const regionsPage = definePage({
  id: 'regions',
  title: 'Local groups',
  path: '/regions',
  help: 'The groups themselves (names, intros, organisers, updates) are edited under Regions in the menu. This is the wording around them.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Local groups'),
        description: text(
          'Description',
          'DoKAD communities by region, starting with Minnesota. Korean adoptees were placed across four continents; their descendants are scattered the same way.',
        ),
        regionSuffix: line(
          'Description of a group page without an intro (after the group name and status)',
          'A DoKAD community for descendants of Korean adoptees.',
        ),
      },
    },
    hero: {
      title: 'Top of the Local groups page',
      fields: {
        headline: text('Headline', 'Where\nwe are.'),
        lead: text(
          'Introduction',
          'Korean adoptees were placed across four continents, so their descendants are scattered the same way. Most of us live nowhere near another DoKAD — which is why the online group is the real home base, and local chapters are a bonus.',
        ),
        note: line('Handwritten note', 'your city isn’t here? start it. →'),
      },
    },
    live: {
      title: 'Up and running',
      fields: {
        kicker: line('Section label', 'Up and running'),
        one: line('Count: one', 'event'),
        many: line('Count: several', 'events'),
        listed: line('After the count', 'listed'),
        open: line('Button, before the group name', 'Open'),
      },
    },
    waiting: {
      title: 'No organisers yet',
      fields: {
        kicker: line('Section label', 'No organisers yet'),
        lead: text(
          'Text',
          'These are on the map because people have asked, not because anything exists. A region only gets a real page when actual organisers and confirmed information are behind it — we are not going to fake a chapter into being.',
        ),
        status: line('Label next to each place', 'gathering interest'),
        cta: line('Button', 'Put your city on the map'),
        note: line('Handwritten note', 'two people is enough to start'),
      },
    },
    group: {
      title: 'Each group’s page',
      fields: {
        upcoming: line('Section label: events', 'Upcoming here'),
        empty: text(
          'When nothing is scheduled',
          '**Nothing scheduled yet.** Join the list and you will hear first.',
        ),
        emptyCta: line('Button when nothing is scheduled', 'Join DOKADS'),
        who: line('Section label: organisers', 'Who is running this'),
        nobody: line('When there are no organisers', 'Nobody yet. That could be you.'),
        volunteerHead: line('Volunteer card: heading', 'Want to help organise?'),
        volunteerBody: text(
          'Volunteer card: text',
          'You do not need experience, a venue, or a plan. The first meetups are mostly about picking a coffee shop and showing up.',
        ),
        volunteerCta: line('Volunteer card: button', 'Volunteer'),
        volunteerSubject: line('Volunteer card: email subject', 'I would like to help organise'),
        socials: line('Section label: social links', 'Where the day-to-day happens'),
        email: line('Link text for an email address', 'Email us →'),
        open: line('Link text for a website', 'Open →'),
        soon: line('When a link does not exist yet', 'Coming soon'),
        privacy: text(
          'Note about outside platforms',
          '**A note on outside platforms.** Facebook and Instagram groups are run on someone else’s infrastructure, under their privacy terms and their data collection — not ours. Anything you post there is subject to their rules. This website stays the permanent, searchable home for information; the social groups are just where conversation happens day to day.',
        ),
        updates: line('Section label: updates', 'Community updates'),
        closeBefore: line('Bottom headline, before the group name', 'Get'),
        closeAfter: line('Bottom headline, after the group name', 'updates'),
        closeLead: text(
          'Bottom text',
          'Local email updates only — you can pick this region specifically on the join form.',
        ),
        closeCta: line('Bottom button', 'Join DOKADS'),
      },
    },
    minnesota: {
      title: 'Minnesota page only',
      fields: {
        note: line('Handwritten note at the top', 'the first one happened — September 2026'),
        partnersKicker: line('Section label', 'On other organisations'),
        partners: paras('Text', [
          'Minnesota has one of the largest Korean adoptee populations anywhere, and adoptee-led organisations here have been doing this work far longer than we have. One of them is why this site exists: **DOKADS is powered by [AK Connection](https://www.akconnection.com)**, the Minnesota community organisation for adult Korean adoptees.',
          'That support looks exactly like our community-led principle: adoptees backing the next generation’s space without directing it. DoKAD programming is still shaped and led by DoKADs, and **being here does not require any prior connection to AK Connection** or any other organisation.',
        ]),
        cardEyebrow: line('Card: label', 'Community principle'),
        cardCta: line('Card: button', 'Read more'),
      },
    },
  },
})
