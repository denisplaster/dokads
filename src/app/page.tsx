import type { Metadata } from 'next'
import { Home } from '@/views/Home'

export const metadata: Metadata = {
  description:
    'DOKADS is a community and learning hub for children, grandchildren, and other descendants of Korean adoptees.',
}

export default function Page() {
  return <Home />
}
