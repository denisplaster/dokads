import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Start } from '@/views/Start'

const meta = copy('start').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <Start />
}
