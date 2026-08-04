import type { Metadata } from 'next'
import { NotFound } from '@/views/NotFound'

export const metadata: Metadata = {
  title: 'Not here',
  description: 'This page does not exist, or it moved, or it was never made.',
}

export default function NotFoundPage() {
  return <NotFound />
}
