import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { Guidelines } from '@/views/Guidelines'

const meta = copy('guidelines').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <Guidelines />
}
