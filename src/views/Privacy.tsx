import Link from 'next/link'
import {
  EditorialHeadline,
  IssueLabel,
  PaperCard,
  SectionHead,
  ZineSection,
} from '../components/zine'
import { AGGREGATE_LINE, MINOR_NOTICE, PRIVACY_LINE } from '../data/joinForm'
import { CONTACT_EMAIL, isStatic } from '../lib/site-mode'

/**
 * Two accurate versions, picked by the site mode — never one that describes
 * collection the site is not doing. In static mode the honest answer is much
 * shorter: nothing is collected at all.
 */
export function Privacy() {
  const collecting = !isStatic()

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
          <p className="lead page-hero__lead">
            {collecting
              ? PRIVACY_LINE
              : 'This site does not collect anything about you. No account, no forms, no tracking.'}
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="bright" className="privacy-body">
        <div className="wrap">
          <PaperCard className="editor-note" tilt="hair" shadow="lift">
            {collecting ? (
              <>
                <strong>Status:</strong> the forms on this site are live. What you submit is
                stored in our database and handled exactly as described below, and confirmations
                are sent by email where you have given us an address. Last reviewed August 2026.
              </>
            ) : (
              <>
                <strong>Status:</strong> DOKADS is currently an informational site only. There
                are no forms, no sign-ups, and no accounts — nothing on this website collects or
                stores anything about you. The rest of this page says what that means, and what
                will change if that ever does. Last reviewed October 2026.
              </>
            )}
          </PaperCard>

          <div className="prose privacy-prose">
            {collecting ? (
              <>
                <SectionHead number="01" kicker="What we ask for" />
                <p>
                  A name you go by and an email address, so we can tell you about things.
                  Everything else — age range, region, family connection, interests, timing,
                  venues — is optional and can be skipped.
                </p>
                <p>
                  We do not ask for an exact date of birth, adoption records, birth-family
                  information, or documentation of anyone’s family history. You will never be
                  asked to prove you belong here.
                </p>

                <SectionHead number="02" kicker="What we do with it" />
                <p>{AGGREGATE_LINE}</p>
                <p>
                  Individual answers are not published, not shared with other organisations, and
                  not used to build a public directory. Aggregate patterns — “most people want
                  weekend afternoons” — are what shape the programme, and those are the only
                  things that get reported back to the community.
                </p>

                <SectionHead number="03" kicker="If you are under 18" />
                <p>{MINOR_NOTICE}</p>
              </>
            ) : (
              <>
                <SectionHead number="01" kicker="What this site collects" />
                <p>
                  Nothing. There is no sign-up form, no registration form, no comment box, and
                  no account to create. We run no analytics, set no tracking cookies, and
                  embed nothing from advertising networks. You can read every page here without
                  telling us anything at all, and without us knowing you did.
                </p>
                <p>
                  The fonts are served from this site rather than a font provider, so loading a
                  page does not report your visit to anyone else either.
                </p>

                <SectionHead number="02" kicker="If you email us" />
                <p>
                  Several pages invite you to write to{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. That is ordinary
                  email — it reaches a mailbox a person reads, and it is handled like any other
                  message, not fed into a database or a mailing list. Ask us to delete your
                  message and that is the end of it, with no form and no reason needed.
                </p>
                <p>
                  Please send only what you are comfortable having in an inbox. You never need
                  to share adoption records, birth-family information, or documentation of
                  anyone’s family history to take part in anything here.
                </p>

                <SectionHead number="03" kicker="If you are under 18" />
                <p>
                  Nothing on this site asks your age, because nothing on this site collects
                  anything. If you email us and tell us you are under 18, we will not add you to
                  any directory, research list, or unrestricted group, and some events will ask
                  for a parent or guardian to say yes first.
                </p>
              </>
            )}

            <SectionHead number="04" kicker="Other people’s platforms" />
            <p>
              Links out to other organisations, bookshops, podcasts and social platforms go to
              sites with their own privacy terms and their own data collection, not ours. Once
              you follow a link, you are under their rules rather than this page.
            </p>

            <SectionHead number="05" kicker="Stories and photographs" />
            <p>
              Contributors choose their own byline — full name, first name, pseudonym, or
              anonymous — and can change it or withdraw a piece later. Nothing about birth
              family, adoption records, or family relationships gets published without explicit
              agreement. At events, we ask before photographing or identifying anyone.
            </p>

            <SectionHead number="06" kicker={collecting ? 'Deleting your data' : 'If this changes'} />
            {collecting ? (
              <p>
                Reply to any email from us and ask — or write to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. No form, no reason
                needed, no follow-up questions.
              </p>
            ) : (
              <p>
                When sign-ups open, this page will be rewritten before a single form goes live —
                not after — and will say exactly what is asked for, what it is used for, and how
                to have it deleted. Until you see that, assume this site knows nothing about you,
                because it does not.
              </p>
            )}
          </div>

          <p className="privacy-foot">
            Questions about any of this? Write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — or read the{' '}
            <Link href="/guidelines">community guidelines</Link>, which cover how we handle
            personal information at gatherings.
          </p>
        </div>
      </ZineSection>
    </>
  )
}
