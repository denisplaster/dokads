import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CategorySticker,
  CollageFrame,
  EditorialHeadline,
  HandwrittenNote,
  IssueLabel,
  LocationStamp,
  PaperCard,
  PullQuote,
  SectionHead,
  Sticker,
  ZineArticleCard,
  ZineSection,
} from '../components/zine'
import type { Story } from '../data/stories'
import { Rich } from '../components/Rich'
import { copy } from '../content/copy'
import { vocab } from '../content/vocab'

export function StoryPage({ story, related }: { story: Story; related: Story[] }) {
  const kind = vocab.storyKind(story.kind)
  const t = copy('stories').story
  const disclaimer = copy('shared').legal.disclaimer

  return (
    <>
      {/* magazine-style article header */}
      <ZineSection tone="bright" torn="bottom" className="article-head">
        <div className="wrap wrap--wide">
          <p className="article-head__crumbs">
            <Link href="/stories">{t.crumb}</Link> <span aria-hidden="true">/</span> {kind.label}
          </p>

          <div className="article-head__meta">
            <CategorySticker kind={story.kind} label={kind.label} />
            <IssueLabel issue={story.issue} />
            <span className="eyebrow">
              {story.readingTime} {vocab.story.minRead}
            </span>
            {story.location && <LocationStamp>{story.location}</LocationStamp>}
          </div>

          <EditorialHeadline size="display" className="article-head__title">
            {story.title}
          </EditorialHeadline>

          <p className="lead article-head__dek">{story.dek}</p>

          <p className="article-head__byline">
            {story.byline}
            {!story.byline.toLowerCase().includes('dokads') && (
              <span className="article-head__credit">
                {t.credited} {story.bylineStyle}
              </span>
            )}
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="article-art">
        <div className="wrap wrap--wide">
          <CollageFrame seed={story.slug} variant={story.art} ratio="21 / 9" />
          <p className="caption">
            <Rich text={t.artCaption} />
          </p>
        </div>
      </ZineSection>

      {/* body */}
      <ZineSection tone="paper" tight className="article-body">
        <div className="wrap">
          {story.sensitive && (
            <PaperCard className="legal-flag" tilt="hair" shadow="lift">
              <span className="eyebrow">{t.legalEyebrow}</span>
              <p>
                <Rich text={disclaimer} />
              </p>
              {story.lastReviewed && (
                <p className="legal-flag__date">
                  {t.reviewedBefore}{' '}
                  <time dateTime={story.lastReviewed}>
                    {new Date(`${story.lastReviewed}T12:00:00`).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                  {t.reviewedAfter}
                </p>
              )}
            </PaperCard>
          )}

          {story.isPlaceholder && (
            <PaperCard className="placeholder-flag" tilt="hair" shadow="lift">
              <Rich text={t.placeholder} />
            </PaperCard>
          )}

          <div className="prose article-prose">
            {story.body.map((para, i) =>
              para.startsWith('> ') ? (
                <PullQuote key={i} className="article-prose__quote">
                  <Rich text={para.slice(2)} />
                </PullQuote>
              ) : (
                <p key={i}>
                  <Rich text={para} />
                </p>
              ),
            )}
          </div>

          {story.sources && story.sources.length > 0 && (
            <aside className="article-sources">
              <h2 className="eyebrow">{t.sources}</h2>
              <ul>
                {story.sources.map((src) => (
                  <li key={src.href}>
                    <a href={src.href} target="_blank" rel="noreferrer">
                      {src.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="article-foot">
            <div className="article-foot__note">
              <HandwrittenNote tiltDir={-1}>{t.footNote}</HandwrittenNote>
            </div>
            <div className="article-foot__actions">
              <Sticker to="/stories#submit" color="red" large>
                {t.footStory}
              </Sticker>
              <Sticker to="/join" color="yellow" large tiltDir={1}>
                {t.footJoin}
              </Sticker>
            </div>
          </div>
        </div>
      </ZineSection>

      {/* related */}
      <ZineSection tone="ink" torn="top" className="article-related">
        <div className="wrap wrap--wide">
          <SectionHead number="→" kicker={t.related} />
          <div className="grid grid--3">
            {related.map((s, i) => (
              <ZineArticleCard key={s.slug} story={s} index={i} layout="text" />
            ))}
          </div>
        </div>
      </ZineSection>
    </>
  )
}
