import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { About } from '@/views/About'

const meta = copy('about').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <About />
}
