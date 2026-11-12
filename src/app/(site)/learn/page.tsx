import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Learn } from '@/views/Learn'

const meta = copy('learn').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <Learn />
}
