import type { Metadata } from 'next'
import { AmIaDokad } from '@/views/AmIaDokad'
import { copy } from '@/content/copy'

const meta = copy('am-i-a-dokad').meta

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function Page() {
  return <AmIaDokad definition={copy('shared').definition} text={copy('am-i-a-dokad')} />
}
