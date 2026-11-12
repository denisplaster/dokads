import type { Metadata } from 'next'
import { NotFound } from '@/views/NotFound'
import { copy } from '@/content/copy'

const t = copy('shared').notFound

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
}

export default function NotFoundPage() {
  return <NotFound />
}
