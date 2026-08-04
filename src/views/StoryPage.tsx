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
import { STORY_KINDS } from '../data/stories'
import type { Story } from '../data/stories'

export function StoryPage({ story, related }: { story: Story; related: Story[] }) {
  const kind = STORY_KINDS[story.kind]

  return (
    <>
      {/* magazine-style article header */}
      <ZineSection tone="bright" torn="bottom" className="article-head">
        <div className="wrap wrap--wide">
          <p className="article-head__crumbs">
            <Link href="/stories">Stories</Link> <span aria-hidden="true">/</span> {kind.label}
          </p>

          <div className="article-head__meta">
            <CategorySticker kind={story.kind} label={kind.label} />
            <IssueLabel issue={story.issue} />
            <span className="eyebrow">{story.readingTime} min read</span>
            {story.location && <LocationStamp>{story.location}</LocationStamp>}
          </div>

          <EditorialHeadline size="display" className="article-head__title">
            {story.title}
          </EditorialHeadline>

          <p className="lead article-head__dek">{story.dek}</p>

          <p className="article-head__byline">
            {story.byline}
            <span className="article-head__credit">
              credited as: {story.bylineStyle}
            </span>
          </p>
        </div>
      </ZineSection>

      <ZineSection tone="paper" className="article-art">
        <div className="wrap wrap--wide">
          <CollageFrame seed={story.slug} variant={story.art} ratio="21 / 9" />
          <p className="caption">
            <strong>Above</strong> — generated artwork. DOKADS does not use stock photography of
            Korean or mixed-race families, and does not use AI-generated people in place of real
            community members.
          </p>
        </div>
      </ZineSection>

      {/* body */}
      <ZineSection tone="paper" tight className="article-body">
        <div className="wrap">
          <PaperCard className="placeholder-flag" tilt="hair" shadow="lift">
            <strong>Placeholder piece.</strong> Issue 001 has not been published yet. This is
            layout copy, not anyone’s real account.
          </PaperCard>

          <div className="prose article-prose">
            {story.body.map((para, i) =>
              para.startsWith('> ') ? (
                <PullQuote key={i} className="article-prose__quote">
                  {para.slice(2)}
                </PullQuote>
              ) : (
                <p key={i}>{para}</p>
              ),
            )}
          </div>

          <div className="article-foot">
            <div className="article-foot__note">
              <HandwrittenNote tiltDir={-1}>
                you can withdraw a piece at any time
              </HandwrittenNote>
            </div>
            <div className="article-foot__actions">
              <Sticker to="/stories#submit" color="red" large>
                Tell us your story
              </Sticker>
              <Sticker to="/join" color="yellow" large tiltDir={1}>
                Join DOKADS
              </Sticker>
            </div>
          </div>
        </div>
      </ZineSection>

      {/* related */}
      <ZineSection tone="ink" torn="top" className="article-related">
        <div className="wrap wrap--wide">
          <SectionHead number="→" kicker="Read this next" />
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
