'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import { Rich } from '../components/Rich'
import type { Copy } from '../content/copy'

const SNIPPET_TONES = ['yellow', 'blue', 'pink', 'acid']

export type ShareText = Copy<'share'>
type Snippet = ShareText['snippets']['list'][number] & { tone: string }

function CopyBlock({
  snippet,
  index,
  labels,
}: {
  snippet: Snippet
  index: number
  labels: { copy: string; copied: string }
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
        {copied ? labels.copied : labels.copy}
      </button>
    </PaperCard>
  )
}

function AssetPreview({
  kind,
  label,
  note,
  download,
}: {
  kind: AssetKind
  label: string
  note: string
  download: string
}) {
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
        <span className="asset__label">{label}</span>
        <span className="asset__size">
          {meta.size} · {note}
        </span>
        <button type="button" className="btn btn--ghost" onClick={() => downloadSvg(kind)}>
          {download}
        </button>
      </figcaption>
    </figure>
  )
}

export function Share({ text: c }: { text: ShareText }) {
  const SNIPPETS = c.snippets.list.map((s, i) => ({
    ...s,
    tone: SNIPPET_TONES[i % SNIPPET_TONES.length],
  }))
  return (
    <>
      <ZineSection tone="red" torn="bottom" className="page-hero">
        <div className="wrap wrap--wide">
          <IssueLabel />
          <EditorialHeadline size="display" className="page-hero__head">
            <Rich text={c.hero.headline} />
          </EditorialHeadline>
          <p className="lead page-hero__lead">
            <Rich text={c.hero.lead} />
          </p>
          <p className="page-hero__aside">
            <HandwrittenNote color="paper" tiltDir={1}>
              {c.hero.note}
            </HandwrittenNote>
          </p>
        </div>
      </ZineSection>

      {/* the framing note */}
      <ZineSection tone="paper" tight className="share-note">
        <div className="wrap wrap--wide">
          <PaperCard className="editor-note" tilt="hair" tiltDir={-1} shadow="lift" ruled>
            <TapeStrip position="top-left" variant="kraft" width={120} />
            <span className="eyebrow">{c.framing.eyebrow}</span>
            <p>
              <Rich text={c.framing.body} />
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      {/* copy snippets */}
      <ZineSection tone="bright" torn="both" className="share-copy">
        <div className="wrap wrap--wide">
          <SectionHead number="01" kicker={c.snippets.kicker} />
          <div className="grid grid--2">
            {SNIPPETS.map((s, i) => (
              <CopyBlock key={`${s.label}-${i}`} snippet={s} index={i} labels={c.snippets} />
            ))}
          </div>
        </div>
      </ZineSection>

      {/* assets */}
      <ZineSection tone="paper" className="share-assets">
        <div className="wrap wrap--wide">
          <SectionHead number="02" kicker={c.assets.kicker} />
          <p className="lead">
            <Rich text={c.assets.lead} />
          </p>
          <div className="assets-grid">
            {ASSETS.map((a, i) => (
              <AssetPreview
                key={a.kind}
                kind={a.kind}
                label={c.assets.labels[i]?.label ?? a.label}
                note={c.assets.labels[i]?.note ?? a.note}
                download={c.assets.download}
              />
            ))}
          </div>
        </div>
      </ZineSection>

      {/* QR */}
      <ZineSection tone="ink" torn="top" className="share-qr">
        <div className="wrap wrap--wide share-qr__inner">
          <div>
            <SectionHead number="03" kicker={c.qr.kicker} />
            <EditorialHeadline size={1}>
              <Rich text={c.qr.headline} />
            </EditorialHeadline>
            <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
              {c.qr.body.map((para) => (
                <p key={para.slice(0, 32)}>
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </div>
          <PaperCard className="share-qr__card" tilt="nudge" tiltDir={-1} shadow="slab">
            <span className="share-qr__slot" aria-hidden="true">
              <span>QR</span>
            </span>
            <p className="share-qr__url">{c.qr.url}</p>
            <p className="share-qr__note">
              <Rich text={c.qr.note} />
            </p>
          </PaperCard>
        </div>
      </ZineSection>

      {/* platforms */}
      <ZineSection tone="lavender" className="share-platforms">
        <div className="wrap wrap--wide">
          <SectionHead number="04" kicker={c.platforms.kicker} />
          <div className="share-platforms__grid">
            {c.platforms.list.map((p, i) => (
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
            <Rich text={c.platforms.privacy} />
          </p>
          <div className="share-platforms__cta">
            <Link href="/join" className="btn btn--red btn--lg">
              {c.platforms.cta}
            </Link>
            <Sticker to="/am-i-a-dokad" color="yellow" large>
              {c.platforms.sticker}
            </Sticker>
          </div>
        </div>
      </ZineSection>
    </>
  )
}
