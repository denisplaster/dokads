import Link from 'next/link'
import {
  EditorialHeadline,
  IssueLabel,
  PaperCard,
  SectionHead,
  ZineSection,
} from '../components/zine'
import { AGGREGATE_LINE, MINOR_NOTICE, PRIVACY_LINE } from '../data/joinForm'
import { CONTACT_EMAIL, collectsData } from '../lib/site-mode'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'

function Paras({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p) => (
        <p key={p.slice(0, 32)}>
          <Rich text={p} />
        </p>
      ))}
    </>
  )
}

/**
 * Two accurate versions, picked by the site mode — never one that describes
 * collection the site is not doing. In static mode the honest answer is much
 * shorter: nothing is collected at all.
 *
 * The no-collection version (static and cms mode) is editable in the admin.
 * The full-mode version describes the forms and stays in code alongside them.
 */
export function Privacy() {
  const collecting = collectsData()
  const c = copy('privacy')
  const b = c.body

  return (
    <>
      <ZineSection tone="paper" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            {collecting ? PRIVACY_LINE : <Rich text={c.hero.lead} />}
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
              <Rich text={c.hero.status} />
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
                <SectionHead number="01" kicker={b.s1} />
                <Paras items={b.s1Body} />

                <SectionHead number="02" kicker={b.s2} />
                <Paras items={b.s2Body} />

                <SectionHead number="03" kicker={b.s3} />
                <Paras items={b.s3Body} />
              </>
            )}

            <SectionHead number="04" kicker={b.s4} />
            <Paras items={b.s4Body} />

            <SectionHead number="05" kicker={b.s5} />
            <Paras items={b.s5Body} />

            <SectionHead number="06" kicker={collecting ? 'Deleting your data' : b.s6} />
            {collecting ? (
              <p>
                Reply to any email from us and ask — or write to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. No form, no reason
                needed, no follow-up questions.
              </p>
            ) : (
              <Paras items={b.s6Body} />
            )}
          </div>

          <p className="privacy-foot">
            <Rich text={b.foot} />
          </p>
        </div>
      </ZineSection>
    </>
  )
}
