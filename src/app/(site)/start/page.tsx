import type { Metadata } from 'next'
import { Start } from '@/views/Start'

export const metadata: Metadata = {
  title: 'Start here',
  description:
    'Six ways into DOKADS. Pick whichever one sounds most like you today — there is no correct order.',
}

export default function Page() {
  return <Start />
}
