import type { Metadata } from 'next'
import { Guidelines } from '@/views/Guidelines'

export const metadata: Metadata = {
  title: 'Community guidelines',
  description:
    'Short, and mostly about not making anyone justify their own family.',
}

export default function Page() {
  return <Guidelines />
}
