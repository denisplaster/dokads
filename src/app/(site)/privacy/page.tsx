import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Privacy } from '@/views/Privacy'

const meta = copy('privacy').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <Privacy />
}
