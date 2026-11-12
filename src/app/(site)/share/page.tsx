import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Share } from '@/views/Share'

const meta = copy('share').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <Share text={copy('share')} />
}
