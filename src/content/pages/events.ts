import { definePage, line, list, paras, text } from '../fields'

export const eventsPage = definePage({
  id: 'events',
  title: 'Events',
  path: '/events',
  help: 'The events themselves are edited under Events in the menu. This is the wording around them, on the Events page and on each event’s page.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Events'),
        description: text(
          'Description',
          'Coffee meetups, online gatherings, and guided conversations for descendants of Korean adoptees. Mostly free, mostly informal.',
        ),
      },
    },
    hero: {
      title: 'Top of the Events page',
      fields: {
        headline: text('Headline', 'Coming\nup.'),
        leadUpcoming: text(
          'Introduction (something scheduled)',
          'Coffee meetups, online gatherings, guided conversations, and the occasional workshop. Small, mostly free, and shaped by whoever turns up.',
        ),
        leadNone: text(
          'Introduction (nothing scheduled)',
          'Nothing is on the calendar right now. The first DoKAD meetup happened in September — here is how that went, and how to hear about the next one first.',
        ),
        note: line('Handwritten note', 'weekends + evenings, mostly — you told us'),
      },
    },
    key: {
      title: 'Read the label',
      help: 'The status names and explanations are edited under “Labels and statuses”.',
      fields: {
        eyebrow: line('Small label', 'Read the label'),
        body: text(
          'Text',
          'Every event here shows where it actually stands. A real plan can still be tentative — date or venue not settled — and when it is, it says so. Ideas that are not plans yet are not listed at all.',
        ),
      },
    },
    latest: {
      title: 'Last time (the most recent past event)',
      fields: {
        kicker: line('Section label', 'Last time'),
        when: line('Row: when', 'When'),
        time: line('Row: time', 'Time'),
        where: line('Row: where', 'Where'),
        who: line('Row: who', 'Who'),
        host: line('Row: hosted by', 'Hosted by'),
        cta: line('Button 1', 'About this one'),
        next: line('Button 2', 'Tell us you want the next one'),
        nextSubject: line('Email subject for button 2', 'Interested in the next DoKAD meetup'),
        scrawl: line('Handwritten note', 'the first one happened!'),
      },
    },
    wall: {
      title: 'The list of events',
      fields: {
        kicker: line('Section label', 'Coming up'),
        empty: paras('When nothing is scheduled', [
          '**Nothing scheduled right now.** When the next gathering is real — date, place and host confirmed — it goes here first. Ideas that are not plans yet do not get listed.',
          'Want a say in what happens next? Tell us what would suit you: a time, a kind of gathering, a part of the world.',
        ]),
        emptyCta: line('Button when nothing is scheduled', 'Email us an idea'),
        ideaSubject: line('Email subject for event ideas', 'Event idea for DOKADS'),
        filterType: line('Filter: type', 'Type'),
        filterFormat: line('Filter: format', 'Format'),
        filterWho: line('Filter: who it’s for', 'Who it’s for'),
        filterAll: line('Filter: all', 'All'),
        formatOnline: line('Format filter: online', 'online'),
        formatInPerson: line('Format filter: in person', 'in person'),
        one: line('Count: one event', 'event'),
        many: line('Count: several events', 'events'),
        noMatch: text(
          'When the filters match nothing',
          '**Nothing matches that combination yet.** Tell us what you want and we will try to make it exist.',
        ),
        noMatchCta: line('Button when the filters match nothing', 'Request an event'),
        earlier: line('Heading for older events', 'Earlier'),
      },
    },
    eventPage: {
      title: 'Each event’s page: details',
      fields: {
        crumb: line('Breadcrumb', 'Events'),
        date: line('Row: date', 'Date'),
        backupDate: line('Row: backup date', 'Backup date'),
        time: line('Row: time', 'Time'),
        where: line('Row: where', 'Where'),
        who: line('Row: who it’s for', 'Who it’s for'),
        ages: line('Row: ages', 'Ages'),
        cost: line('Row: cost', 'Cost'),
        region: line('Row: region', 'Region'),
        online: line('Region when there is none', 'Online'),
        tentativeSuffix: line(
          'Heading of the “not settled yet” box, after the status',
          '— here is what that means',
        ),
        tentativeNote: line('Handwritten note in that box', 'we’ll tell you the moment it’s real'),
        whoKicker: line('Section label', 'Who this is for'),
      },
    },
    eventRules: {
      title: 'Each event’s page: the rules',
      help: 'Shown for events that have not happened yet.',
      fields: {
        heading: line('Heading', 'The rules for this one'),
        plusOnes: line('Plus-ones: label', 'Plus-ones:'),
        plusYes: line('Plus-ones allowed', 'Bring someone if you like.'),
        plusNo: line(
          'Plus-ones not allowed',
          'Not for this one — we are keeping the first gatherings small enough to actually talk.',
        ),
        capacity: line('Capacity: label', 'Capacity:'),
        people: line('Capacity: after the number', 'people.'),
        waitlist: line('Waitlist: label', 'Waitlist:'),
        waitYes: line('Waitlist: yes', 'Yes, if it fills up.'),
        waitNo: line('Waitlist: no', 'No waitlist.'),
        minAge: line('Minimum age: label', 'Minimum age:'),
        under: line('Guardian rule: before the age', 'Under'),
        guardian: line('Guardian rule: after the age', 'a parent or guardian needs to confirm by email.'),
        deadline: line('Deadline: label', 'Register by:'),
        perk: line('Perk: label', 'Hoping to offer:'),
        perkTentative: line('Perk on a tentative event', 'Not confirmed — do not count on it yet.'),
        guidelines: text(
          'Guidelines card',
          '**Everyone who registers agrees to the community guidelines.** They are short, and they are mostly about not making anyone justify their own family.',
        ),
        guidelinesCta: line('Guidelines card: button', 'Read the guidelines'),
      },
    },
    eventSide: {
      title: 'Each event’s page: the side card',
      fields: {
        pastHead: line('After the event: heading', 'This one has happened'),
        cancelledHead: line('Cancelled: heading', 'This one was cancelled'),
        hostLink: line('Link to the host’s page, after their name', '’s page for this event ↗'),
        next: line('After the event: button', 'Tell us you want the next one'),
        nextSubject: line('After the event: email subject', 'Interested in the next DoKAD meetup'),
        comeHead: line('Before the event: heading', 'Want to come?'),
        comeBody: text(
          'Before the event: text',
          'Online sign-ups are not open yet. Email us and we will put you on the list by hand — tell us your name and anything we should know, like access needs.',
        ),
        comeEmail: line('Before the event: button (the address is added after it)', 'Email'),
        comeSubject: line(
          'Before the event: email subject (the event title is added after it)',
          'Interested:',
        ),
        comeFoot: text(
          'Before the event: small print',
          'Nothing you send is stored on this website. Ask us to forget you at any time and that is the end of it.',
        ),
      },
    },
    eventClose: {
      title: 'Each event’s page: bottom',
      fields: {
        pastHead: line('Headline after the event', 'Missed it?'),
        head: line('Headline before the event', 'Not this one?'),
        lead: text('Text', 'There will be others, and you can help decide what they are.'),
        cta: line('Button', 'All events'),
        sticker: line('Sticker', 'Tell us what to run'),
      },
    },
    venues: {
      title: 'On venues',
      fields: {
        kicker: line('Section label', 'On venues'),
        body: paras('Text', [
          'A lot of adoptee and diaspora events default to breweries. That does not work for everyone here — some of you are under 21, some do not drink, and some just want to hear the person across the table.',
          'So the default is coffee shops, libraries, community centres, parks, restaurants, universities, and video calls. Alcohol-serving venues are an option, not the baseline.',
        ]),
        stickers: list('Stickers', [
          'Coffee shop',
          'Library',
          'Community center',
          'Park',
          'Restaurant',
          'University',
          'Online',
        ]),
      },
    },
  },
})
