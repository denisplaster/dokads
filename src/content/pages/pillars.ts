import { definePage, items, line, list, paras } from '../fields'
import { pillars as base } from '../../data/pillars'

/**
 * The four Who / What / Where / Why panels (homepage and Learn). The panel
 * colours, artwork and link targets stay in src/data/pillars.ts; the words
 * are editable.
 */
export const pillarsPage = definePage({
  id: 'pillars',
  title: 'Who / What / Where / Why',
  path: '/learn',
  help: 'The four panels on the homepage, and their long versions on the Learn page.',
  sections: {
    panels: {
      title: 'Panels',
      fields: {
        panels: items(
          'Panels',
          {
            word: line('Big word', ''),
            question: line('Question', ''),
            dek: line('One-line answer', ''),
            points: list('Bullet points (homepage)', []),
            note: line('Handwritten note (homepage)', ''),
            body: paras('Long version (Learn page)', []),
          },
          base.map((p) => ({
            word: p.word,
            question: p.question,
            dek: p.dek,
            points: [...p.points],
            note: p.note,
            body: [...p.body],
          })),
          { fixed: true, itemTitle: 'word', noun: 'panel' },
        ),
      },
    },
  },
})
