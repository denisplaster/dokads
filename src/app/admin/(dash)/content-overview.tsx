import Link from 'next/link'
import { count, eq, ne, sql } from 'drizzle-orm'
import { db } from '@/db'
import { events, pageCopy, regions, resources, stories } from '@/db/schema'
import { emailConfigured } from '@/lib/email/send'
import { IMPORT_KEY, getMeta } from '@/content/meta'
import type { ImportReport } from '@/content/build-snapshot'

async function n(q: Promise<{ n: number }[]>) {
  return (await q)[0]?.n ?? 0
}

export async function ContentOverview() {
  const [eventsLive, eventsDraft, storiesLive, storiesDraft, resourcesLive, regionPages, edits, imported] =
    await Promise.all([
      n(db.select({ n: count() }).from(events).where(ne(events.status, 'draft'))),
      n(db.select({ n: count() }).from(events).where(eq(events.status, 'draft'))),
      n(db.select({ n: count() }).from(stories).where(eq(stories.status, 'published'))),
      n(db.select({ n: count() }).from(stories).where(eq(stories.status, 'draft'))),
      n(db.select({ n: count() }).from(resources).where(eq(resources.published, true))),
      n(db.select({ n: count() }).from(regions).where(sql`${regions.status} <> 'interest'`)),
      n(db.select({ n: count() }).from(pageCopy)),
      getMeta(IMPORT_KEY) as Promise<ImportReport | undefined>,
    ])

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Overview</h1>
          <p>Everything on the public site is edited from here.</p>
        </div>
      </div>

      <section className="adm-card">
        <h2>How editing works</h2>
        <ol className="adm-steps">
          <li>
            <strong>Edit.</strong> Events, stories, resources and local groups each have their
            own section. Every other piece of wording — headlines, introductions, buttons, the
            menu and footer — is under <Link href="/admin/pages">Pages</Link>.
          </li>
          <li>
            <strong>Save.</strong> Saving stores your change, but visitors do not see it yet.
          </li>
          <li>
            <strong>Publish.</strong> When you are ready, press <em>Publish site</em> in the
            yellow bar at the top. The site rebuilds and your changes are live in a minute or
            two. You can save many changes and publish them all at once.
          </li>
        </ol>
        <p className="adm-field__help">
          Drafts (events and stories marked draft) are never published, so you can work on
          something over several days.
        </p>
      </section>

      <div className="adm-stats">
        <Link href="/admin/events" className="adm-stat">
          <div className="adm-stat__n">{eventsLive}</div>
          <div className="adm-stat__label">
            Events on the site{eventsDraft ? ` · ${eventsDraft} draft` : ''}
          </div>
        </Link>
        <Link href="/admin/stories" className="adm-stat">
          <div className="adm-stat__n">{storiesLive}</div>
          <div className="adm-stat__label">
            Stories published{storiesDraft ? ` · ${storiesDraft} draft` : ''}
          </div>
        </Link>
        <Link href="/admin/resources" className="adm-stat">
          <div className="adm-stat__n">{resourcesLive}</div>
          <div className="adm-stat__label">Resources listed</div>
        </Link>
        <Link href="/admin/regions" className="adm-stat">
          <div className="adm-stat__n">{regionPages}</div>
          <div className="adm-stat__label">Local group pages</div>
        </Link>
        <Link href="/admin/pages" className="adm-stat">
          <div className="adm-stat__n">{edits}</div>
          <div className="adm-stat__label">Page text fields changed</div>
        </Link>
      </div>

      {!emailConfigured() && (
        <p className="adm-note">
          <strong>“Forgot password” emails are switched off.</strong> If an editor is locked out,
          any other editor can make them a new password link under{' '}
          <Link href="/admin/editors">Editors</Link>.
        </p>
      )}

      {imported && (
        <section className="adm-card">
          <h2>Where this content came from</h2>
          <p>
            On{' '}
            {new Date(imported.at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            the content the site was already showing was copied in here: {imported.events}{' '}
            events, {imported.stories} stories, {imported.regions} regions and{' '}
            {imported.resources} resources.
          </p>
          {imported.hidden.length > 0 && (
            <>
              <p style={{ marginTop: 'var(--s-3)' }}>
                These older records were already in the database but were not on the site, so
                they were hidden rather than deleted. Delete them, or edit and publish them if
                they are still wanted:
              </p>
              <ul className="adm-steps">
                {imported.hidden.map((h) => (
                  <li key={`${h.kind}:${h.key}`}>
                    {h.kind}: {h.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </>
  )
}
