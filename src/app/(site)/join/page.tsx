import type { Metadata } from 'next'
import { Join } from '@/views/Join'
import { JoinInfo } from '@/views/JoinInfo'
import { isStatic } from '@/lib/site-mode'

export const metadata: Metadata = {
  title: 'Join DOKADS',
  description:
    'Sign-ups are not open yet. Read everything here, and email us if you want to hear when something starts.',
}

export default function Page() {
  // static mode collects nothing, so the questionnaire is replaced by an
  // honest informational page rather than a form that goes nowhere
  return isStatic() ? <JoinInfo /> : <Join />
}
