import { definePage, items, line, list, text } from '../fields'
import { LEGAL_DISCLAIMER, LEGAL_RULES } from '../../data/topics'

/** Text that appears on more than one page. */
export const shared = definePage({
  id: 'shared',
  title: 'Site-wide text',
  path: null,
  help: 'Menus, the footer, the “What is a DoKAD?” card, and wording repeated across pages.',
  sections: {
    meta: {
      title: 'Search engines and link previews',
      help: 'What Google and shared links show when a page has no text of its own.',
      fields: {
        title: line('Site title', 'DOKADS — For the next generation of Korean adoption stories'),
        description: text(
          'Site description',
          'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
        ),
        shareTitle: line('Link preview title', 'DOKADS / Issue 001'),
        shareDescription: text(
          'Link preview description',
          'Was your parent or grandparent adopted from Korea? A community for descendants of Korean adoptees.',
        ),
      },
    },
    definition: {
      title: '“What is a DoKAD?” card',
      help: 'Appears on the homepage, Start here, Am I a DoKAD? and Join.',
      fields: {
        label: line('Card label', 'What is a DoKAD?'),
        pronunciation: line('Pronunciation', '/ DOH-kad /'),
        partOfSpeech: line('Word type', 'noun'),
        first: text(
          'First definition paragraph',
          'A **descendant of a Korean adoptee**. Most often the child of someone adopted from Korea — sometimes the grandchild, sometimes further down.',
        ),
        second: text(
          'Second definition paragraph',
          'If your parent or grandparent was adopted from Korea, that is you. There is no test to pass and no box you have to tick.',
        ),
        cta: line('Button', 'Am I a DoKAD?'),
        note: line('Handwritten note', 'never heard it before? same.'),
        strip: text(
          'One-line version (Learn page)',
          '*noun.* A descendant of a Korean adoptee. Say it “DOH-kad.”',
        ),
        stripLink: line('One-line version: link', 'Am I one? →'),
      },
    },
    principle: {
      title: 'The community-led principle',
      help: 'Shown on the homepage, About and the Minnesota page.',
      fields: {
        headline: line('The principle', 'DoKAD programming should be shaped and led by DoKADs.'),
        body: text(
          'Short explanation',
          'Korean adoptees, parents, organizations, researchers, and allies may provide support, resources, mentorship, funding, or partnership — but descendants should have meaningful leadership in decisions about DoKAD programming.',
        ),
        about: text(
          'Longer explanation (About page)',
          'DOKADS recognizes that the Korean adoptee community made this generation possible and that adoptee voices remain central to conversations about Korean adoption. At the same time, descendants have experiences and questions of their own. DoKAD programs should be developed with DoKAD leadership rather than created solely on their behalf.',
        ),
      },
    },
    legal: {
      title: 'Legal and immigration content',
      help: 'The disclaimer appears on every story marked “legal / immigration” and on the Learn page.',
      fields: {
        disclaimer: text('Disclaimer', LEGAL_DISCLAIMER),
        rules: list('The five rules (Learn page)', LEGAL_RULES),
      },
    },
    reassurances: {
      title: 'Reassurances',
      help: 'Short phrases used on Start here (first five) and Join.',
      fields: {
        items: list('Phrases', [
          'Never heard the word DoKAD before? You are not alone.',
          'Still figuring out whether this describes you? That is okay.',
          'You do not need to know your full family history to take part.',
          'There is no single DoKAD experience.',
          'Your parent’s story and your story can be connected without being identical.',
          'Come meet people who may be asking some of the same questions.',
          'Start with curiosity.',
          'Share only what feels comfortable.',
        ]),
      },
    },
    nav: {
      title: 'Top menu',
      fields: {
        main: items(
          'Main links',
          { label: line('Label', ''), note: line('Handwritten note (full-screen menu)', '') },
          [
            { label: 'Start here', note: 'new? this one' },
            { label: 'Am I a DoKAD?', note: 'takes 30 seconds' },
            { label: 'Stories', note: 'the good stuff' },
            { label: 'Events', note: '' },
            { label: 'Resources', note: 'reading list' },
          ],
          { fixed: true, itemTitle: 'label', noun: 'link', help: 'Each link always goes to the same page; only the words change.' },
        ),
        join: line('Join button', 'Join DOKADS'),
        contents: line('Full-screen menu: first heading', 'Contents'),
        more: line('Full-screen menu: second heading', 'Also inside'),
        moreLinks: items(
          'Full-screen menu: more links',
          { label: line('Label', '') },
          [
            { label: 'Local groups' },
            { label: 'Learn' },
            { label: 'About' },
            { label: 'Guidelines' },
            { label: 'Share DOKADS' },
          ],
          { fixed: true, itemTitle: 'label', noun: 'link' },
        ),
        tagline: line(
          'Full-screen menu: tagline',
          'A space for descendants of Korean adoptees. Still figuring it out? Same.',
        ),
        contact: line('Full-screen menu: sticker', 'Get in touch'),
      },
    },
    footer: {
      title: 'Footer',
      fields: {
        powered: line('Powered-by line', 'Powered by AK Connection'),
        tagline: line('Tagline', 'For the next generation of Korean adoption stories.'),
        join: line('Join sticker', 'Join DOKADS'),
        col1: line('Column 1 heading', 'The zine'),
        col1Links: items(
          'Column 1 links',
          { label: line('Label', '') },
          [
            { label: 'Start here' },
            { label: 'Am I a DoKAD?' },
            { label: 'Learn' },
            { label: 'Stories' },
            { label: 'Events' },
            { label: 'Resources' },
          ],
          { fixed: true, itemTitle: 'label', noun: 'link' },
        ),
        col2: line('Column 2 heading', 'Take part'),
        col2Links: items(
          'Column 2 links',
          { label: line('Label', '') },
          [
            { label: 'Join the community' },
            { label: 'Local groups' },
            { label: 'Minnesota DoKADs' },
            { label: 'Share DOKADS' },
            { label: 'Tell us your story' },
          ],
          { fixed: true, itemTitle: 'label', noun: 'link' },
        ),
        col3: line('Column 3 heading', 'The small print'),
        col3Links: items(
          'Column 3 links',
          { label: line('Label', '') },
          [{ label: 'About' }, { label: 'Community guidelines' }, { label: 'Privacy' }],
          { fixed: true, itemTitle: 'label', noun: 'link' },
        ),
        note: line('Handwritten note', 'made by the community, for the community'),
        legal: line('Small print (after © and the year)', 'DOKADS. Share only what feels comfortable.'),
        admin: line('Sign-in link', 'Organisers'),
      },
    },
    notFound: {
      title: 'Page not found (404)',
      fields: {
        metaTitle: line('Browser tab title', 'Not here'),
        metaDescription: line(
          'Search description',
          'This page does not exist, or it moved, or it was never made.',
        ),
        eyebrow: line('Small label', 'Error 404'),
        headline: text('Headline', 'Not\nhere.'),
        lead: line('Text', 'This page does not exist, or it moved, or it was never made. Happens.'),
        note: line('Handwritten note', 'try one of these instead →'),
        links: items(
          'Links',
          { label: line('Label', '') },
          [{ label: 'Home' }, { label: 'Am I a DoKAD?' }, { label: 'Stories' }, { label: 'Events' }],
          { fixed: true, itemTitle: 'label', noun: 'link' },
        ),
      },
    },
  },
})
