import Link from 'next/link'
import {
  EditorialHeadline,
  IssueLabel,
  PaperCard,
  SectionHead,
  ZineSection,
} from '../components/zine'
import { AGGREGATE_LINE, MINOR_NOTICE, PRIVACY_LINE } from '../data/joinForm'

export function Privacy() {
  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            Privacy,{' '}
            <br />
            plainly.
          </EditorialHeadline>
          <p className="lead page-hero__lead">{PRIVACY_LINE}</p>
        </div>
      </ZineSection>

      <ZineSection tone="bright" className="privacy-body">
        <div className="wrap">
          <PaperCard className="editor-note" tilt="hair" shadow="lift">
            <strong>Status:</strong> the forms on this site are live. What you submit is stored
            in our database and handled exactly as described below, and confirmations are sent
            by email where you have given us an address. Last reviewed August 2026.
          </PaperCard>

          <div className="prose privacy-prose">
            <SectionHead number="01" kicker="What we ask for" />
            <p>
              A name you go by and an email address, so we can tell you about things. Everything
              else — age range, region, family connection, interests, timing, venues — is
              optional and can be skipped.
            </p>
            <p>
              We do not ask for an exact date of birth, adoption records, birth-family
              information, or documentation of anyone’s family history. You will never be asked
              to prove you belong here.
            </p>

            <SectionHead number="02" kicker="What we do with it" />
            <p>{AGGREGATE_LINE}</p>
            <p>
              Individual answers are not published, not shared with other organisations, and not
              used to build a public directory. Aggregate patterns — “most people want weekend
              afternoons” — are what shape the programme, and those are the only things that get
              reported back to the community.
            </p>

            <SectionHead number="03" kicker="If you are under 18" />
            <p>{MINOR_NOTICE}</p>

            <SectionHead number="04" kicker="Other people’s platforms" />
            <p>
              Facebook and Instagram groups run under their own privacy terms and their own data
              collection, not ours. Joining one can be visible to other people on that platform.
              If you would rather not be on them, everything essential stays here on the website
              and in email.
            </p>

            <SectionHead number="05" kicker="Stories and photographs" />
            <p>
              Contributors choose their own byline — full name, first name, pseudonym, or
              anonymous — and can change it or withdraw a piece later. Nothing about birth
              family, adoption records, or family relationships gets published without explicit
              agreement. At events, we ask before photographing or identifying anyone.
            </p>

            <SectionHead number="06" kicker="Deleting your data" />
            <p>
              Reply to any email from us and ask. No form, no reason needed, no follow-up
              questions.
            </p>
          </div>

          <p className="privacy-foot">
            Questions about any of this? <Link href="/join">Get in touch</Link> — or read the{' '}
            <Link href="/guidelines">community guidelines</Link>, which cover how we handle
            personal information at gatherings.
          </p>
        </div>
      </ZineSection>
    </>
  )
}
