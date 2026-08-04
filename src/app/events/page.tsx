import type { Metadata } from 'next'
import { Events } from '@/views/Events'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Coffee meetups, online gatherings, and guided conversations for descendants of Korean adoptees. Mostly free, mostly informal.',
}

export default function Page() {
  return <Events />
}
