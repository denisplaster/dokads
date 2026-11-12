import type { Metadata } from 'next'
import { Join } from '@/views/Join'
import { JoinInfo } from '@/views/JoinInfo'
import { collectsData } from '@/lib/site-mode'
import { copy } from '@/content/copy'

const meta = copy('join').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  // static mode collects nothing, so the questionnaire is replaced by an
  // honest informational page rather than a form that goes nowhere
  return collectsData() ? <Join definition={copy('shared').definition} /> : <JoinInfo />
}
