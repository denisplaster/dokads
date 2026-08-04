import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  PaperCard,
  SectionHead,
  Sticker,
  TapeStrip,
  ZineSection,
  rot,
} from '../components/zine'
import { ASSETS, buildAsset, downloadSvg } from '../lib/shareAssets'
import type { AssetKind } from '../lib/shareAssets'

const SNIPPETS = [
  {
    id: 'parent',
    label: 'For adoptee parents to send their adult children',
    tone: 'yellow',
    text: 'Your child may not know there is a growing community for descendants of Korean adoptees. DOKADS.com is a place where children and grandchildren of Korean adoptees can learn, meet others, and explore how adoption, Korea, identity, and family history may relate to their lives.',
    note: 'An invitation, not an assignment. Nobody has to define anyone else’s identity.',
  },
  {
    id: 'newsletter',
    label: 'For an organisation newsletter',
    tone: 'blue',
    text: 'New this month: DOKADS.com, a community and learning hub for descendants of Korean adoptees — the children, grandchildren, and great-grandchildren of people adopted from Korea. The site explains what the term means, collects stories from the second generation, and lists free online and in-person gatherings. A first local community is forming in Minnesota, and the online group is open to anyone.',
  },
  {
    id: 'partner',
    label: 'For a partner organisation',
    tone: 'pink',
    text: 'DOKADS is a community-led hub for descendants of Korean adoptees. Our one governing principle is that DoKAD programming should be shaped and led by DoKADs, with adoptees, parents, organisations, and researchers supporting rather than directing. If your members include adoptees with adult children, we would welcome a conversation about how to reach them.',
  },
  {
    id: 'short',
    label: 'The one-liner',
    tone: 'acid',
    text: 'Is your parent or grandparent a Korean adoptee? There’s a community for that now: dokads.com',
  },
]

function CopyBlock({
  snippet,
  index,
}: {
  snippet: (typeof SNIPPETS)[number]
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PaperCard
      className="snippet"
      data-tone={snippet.tone}
      style={{ background: 'var(--surface)' }}
      tilt={index % 2 === 0 ? 'hair' : 'nudge'}
      tiltDir={index % 2 === 0 ? 1 : -1}
      shadow="card"
    >
      {index % 2 === 0 && <TapeStrip position="top-right" variant="clear" width={90} />}
      <span className="eyebrow">{snippet.label}</span>
      <p className="snippet__text">{snippet.text}</p>
      {snippet.note && <p className="snippet__note">{snippet.note}</p>}
      <button type="button" className="btn btn--ghost snippet__btn" onClick={copy}>
        {copied ? 'Copied ✓' : 'Copy text'}
      </button>
    </PaperCard>
  )
}

function AssetPreview({ kind }: { kind: AssetKind }) {
  const meta = ASSETS.find((a) => a.kind === kind)!
  const { svg, w, h } = buildAsset(kind)
  return (
    <figure className="asset">
      <div
        className="asset__preview"
        style={{ aspectRatio: `${w} / ${h}` }}
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-hidden="true"
      />
      <figcaption className="asset__cap">
        <span className="asset__label">{meta.label}</span>
        <span className="asset__size">
          {meta.size} · {meta.note}
        </span>
        <button type="button" className="btn btn--ghost" onClick={() => downloadSvg(kind)}>
          Download SVG
        </button>
      </figcaption>
    </figure>
  )
}

export function Share() {
  return (
    <>
      <ZineSection tone="red" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            Share{' '}
            <br />
            DOKADS.
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            Most people will find this through someone else in their family. Here is everything
            you need to pass it on — copy you can send, graphics you can post, and a flyer you
            can print.
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="paper" tiltDir={1}>
              an invitation, not an assignment
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* the framing note */}
      <ZineSection tone="paper" tight className="share-note">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift" ruled>
            <TapeStrip position="top-left" variant="kraft" width={120} />
            <span className="eyebrow">One thing before you send it</span>
            <p>
              If you are an adoptee sharing this with your kid:{' '}
              <strong>this is an invitation, not an assignment.</strong> It is not your job to
              define your child’s identity, and it is not their job to be interested. Send it,
              and let it sit.
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      {/* copy snippets */}
      <ZineSection tone="bright" torn="both" className="share-copy">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker="Words you can steal" />
          <div className="grid grid--2">
            {SNIPPETS.map((s, i) => (
              <CopyBlock key={s.id} snippet={s} index={i} />
            ))}
          </div>
        </div>
      </ZineSection>

      {/* assets */}
      <ZineSection tone="paper" className="share-assets">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker="Graphics + print" />
          <p className="lead">
            All four are plain SVG — post them as they are, or open them in anything and change
            the words.
          </p>
          <div className="assets-grid">
            {ASSETS.map((a) => (
              <AssetPreview key={a.kind} kind={a.kind} />
            ))}
          </div>
        </div>
      </ZineSection>

      {/* QR */}
      <ZineSection tone="ink" torn="top" className="share-qr">
        <div className="wrap wrap--wide share-qr__inner">
          <div>
            <SectionHead number="03" kicker="For outreach tables" />
            <EditorialHeadline size={1}>
              Point a QR code{' '}
              <br />
              at one page.
            </EditorialHeadline>
            <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
              <p>
                The <Link to="/am-i-a-dokad">Am I a DoKAD?</Link> page is built to be the
                landing spot for any code, flyer, or table sign. It works on a phone, explains
                the term from zero, and asks nothing of the reader.
              </p>
              <p>
                The printable flyer above leaves a blank square for the code. Generate it
                against the live URL once the domain is pointed, so it never goes stale.
              </p>
            </div>
          </div>
          <PaperCard className="share-qr__card" tilt="nudge" tiltDir={-1} shadow="slab">
            <span className="share-qr__slot" aria-hidden="true">
              <span>QR</span>
            </span>
            <p className="share-qr__url">dokads.com/am-i-a-dokad</p>
            <p className="share-qr__note">
              Generate against the live domain — do not bake in a preview URL.
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      {/* platforms */}
      <ZineSection tone="lavender" className="share-platforms">
        <div className="wrap wrap--wide">
          <SectionHead number="04" kicker="Where to find us" />
          <div className="share-platforms__grid">
            {[
              { label: 'Minnesota DoKADs Facebook group', state: 'Being set up' },
              { label: 'DOKADS on Instagram', state: 'Being set up' },
              { label: 'Email newsletter', state: 'Sign up on the join form' },
            ].map((p, i) => (
              <PaperCard
                key={p.label}
                tilt="hair"
                tiltDir={i % 2 === 0 ? 1 : -1}
                shadow="lift"
                className="platform-card"
              >
                <h3>{p.label}</h3>
                <p className="platform-card__state">{p.state}</p>
              </PaperCard>
            ))}
          </div>
          <p className="share-platforms__privacy" style={rot('hair', -1)}>
            <strong>About those platforms.</strong> Facebook and Instagram are run by someone
            else, under their privacy terms and their data collection — not ours. Anything you
            post there follows their rules, and joining a group there can be visible to other
            people. This website stays the permanent, searchable hub; the social accounts are
            just for day-to-day conversation. We are not building a private social network into
            this site, at least not yet.
          </p>
          <div className="share-platforms__cta">
            <Link to="/join" className="btn btn--red btn--lg">
              Join DOKADS
            </Link>
            <Sticker to="/am-i-a-dokad" color="yellow" large>
              Am I a DoKAD?
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
