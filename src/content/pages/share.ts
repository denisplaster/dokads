import { definePage, items, line, paras, text } from '../fields'
import { ASSETS } from '../../lib/shareAssets'

export const share = definePage({
  id: 'share',
  title: 'Share DOKADS',
  path: '/share',
  help: 'The downloadable graphics are designed images; their wording is changed in code.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      fields: {
        title: line('Browser tab title', 'Share DOKADS'),
        description: text(
          'Description',
          'Copy you can send, graphics you can post, and a flyer you can print. An invitation, not an assignment.',
        ),
      },
    },
    hero: {
      title: 'Top of the page',
      fields: {
        headline: text('Headline', 'Share\nDOKADS.'),
        lead: text(
          'Introduction',
          'Most people will find this through someone else in their family. Here is everything you need to pass it on — copy you can send, graphics you can post, and a flyer you can print.',
        ),
        note: line('Handwritten note', 'an invitation, not an assignment'),
      },
    },
    framing: {
      title: 'One thing before you send it',
      fields: {
        eyebrow: line('Small label', 'One thing before you send it'),
        body: text(
          'Text',
          'If you are an adoptee sharing this with your kid: **this is an invitation, not an assignment.** It is not your job to define your child’s identity, and it is not their job to be interested. Send it, and let it sit.',
        ),
      },
    },
    snippets: {
      title: 'Words you can steal',
      fields: {
        kicker: line('Section label', 'Words you can steal'),
        list: items(
          'Ready-to-copy texts',
          {
            label: line('Who it is for', ''),
            text: text('The text people copy', '', {
              help: 'Copied exactly as written — formatting marks are not used here.',
            }),
            note: line('Note under it (optional)', ''),
          },
          [
            {
              label: 'For adoptee parents to send their adult children',
              text: 'Your child may not know there is a growing community for descendants of Korean adoptees. DOKADS.com is a place where children and grandchildren of Korean adoptees can learn, meet others, and explore how adoption, Korea, identity, and family history may relate to their lives.',
              note: 'An invitation, not an assignment. Nobody has to define anyone else’s identity.',
            },
            {
              label: 'For an organisation newsletter',
              text: 'New this month: DOKADS.com, a community and learning hub for descendants of Korean adoptees — the children, grandchildren, and great-grandchildren of people adopted from Korea. The site explains what the term means, collects stories from the second generation, and lists free online and in-person gatherings. A first local community is forming in Minnesota, and the online group is open to anyone.',
              note: '',
            },
            {
              label: 'For a partner organisation',
              text: 'DOKADS is a community-led hub for descendants of Korean adoptees. Our one governing principle is that DoKAD programming should be shaped and led by DoKADs, with adoptees, parents, organisations, and researchers supporting rather than directing. If your members include adoptees with adult children, we would welcome a conversation about how to reach them.',
              note: '',
            },
            {
              label: 'The one-liner',
              text: 'Is your parent or grandparent a Korean adoptee? There’s a community for that now: dokads.com',
              note: '',
            },
          ],
          { itemTitle: 'label', noun: 'text' },
        ),
        copy: line('Copy button', 'Copy text'),
        copied: line('Copy button after copying', 'Copied ✓'),
      },
    },
    assets: {
      title: 'Graphics + print',
      fields: {
        kicker: line('Section label', 'Graphics + print'),
        lead: text(
          'Introduction',
          'All four are plain SVG — post them as they are, or open them in anything and change the words.',
        ),
        labels: items(
          'Graphic captions',
          { label: line('Name', ''), note: line('Note', '') },
          ASSETS.map((a) => ({ label: a.label, note: a.note })),
          { fixed: true, itemTitle: 'label', noun: 'graphic' },
        ),
        download: line('Download button', 'Download SVG'),
      },
    },
    qr: {
      title: 'For outreach tables',
      fields: {
        kicker: line('Section label', 'For outreach tables'),
        headline: text('Headline', 'Point a QR code\nat one page.'),
        body: paras('Text', [
          'The [Am I a DoKAD?](/am-i-a-dokad) page is built to be the landing spot for any code, flyer, or table sign. It works on a phone, explains the term from zero, and asks nothing of the reader.',
          'The printable flyer above leaves a blank square for the code. Generate it against the live URL once the domain is pointed, so it never goes stale.',
        ]),
        url: line('Address on the card', 'dokads.com/am-i-a-dokad'),
        note: line('Note on the card', 'Generate against the live domain — do not bake in a preview URL.'),
      },
    },
    platforms: {
      title: 'Where to find us',
      fields: {
        kicker: line('Section label', 'Where to find us'),
        list: items(
          'Places',
          { label: line('Name', ''), state: line('Status', '') },
          [
            { label: 'Minnesota DoKADs Facebook group', state: 'Being set up' },
            { label: 'DOKADS on Instagram', state: 'Being set up' },
            { label: 'Email newsletter', state: 'Sign up on the join form' },
          ],
          { itemTitle: 'label', noun: 'place' },
        ),
        privacy: text(
          'Note about social platforms',
          '**About those platforms.** Facebook and Instagram are run by someone else, under their privacy terms and their data collection — not ours. Anything you post there follows their rules, and joining a group there can be visible to other people. This website stays the permanent, searchable hub; the social accounts are just for day-to-day conversation. We are not building a private social network into this site, at least not yet.',
        ),
        cta: line('Button', 'Join DOKADS'),
        sticker: line('Sticker', 'Am I a DoKAD?'),
      },
    },
  },
})
