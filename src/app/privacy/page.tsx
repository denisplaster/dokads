import type { Metadata } from 'next'
import { Privacy } from '@/views/Privacy'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What we ask for, what we do with it, and how to delete it. Share only what feels comfortable.',
}

export default function Page() {
  return <Privacy />
}
