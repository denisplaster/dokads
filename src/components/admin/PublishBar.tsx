import { CHANGED_KEY, LIVE_KEY, PUBLISH_KEY, getMetas } from '@/content/meta'
import { PublishButton } from './PublishButton'

const when = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * The one thing an editor must not miss: saving changes the database, but the
 * public site only changes when someone publishes.
 */
export async function PublishBar() {
  const meta = await getMetas([CHANGED_KEY, PUBLISH_KEY, LIVE_KEY])
  const changedAt = meta[CHANGED_KEY]?.at as string | undefined
  const changedBy = meta[CHANGED_KEY]?.by as string | undefined
  const requestedAt = meta[PUBLISH_KEY]?.at as string | undefined
  const liveAt = meta[LIVE_KEY]?.snapshotTakenAt as string | undefined

  const unpublished = !!changedAt && (!liveAt || changedAt > liveAt)
  const building = !!requestedAt && (!liveAt || requestedAt > liveAt)
  const editedSinceRequest = unpublished && !!requestedAt && changedAt! > requestedAt

  if (building && !editedSinceRequest) {
    return (
      <div className="adm-publish adm-publish--building" role="status">
        <p>
          <strong>Publishing…</strong> started {when(requestedAt!)}. The site usually updates
          within two minutes — refresh this page to check. If it is still showing this after ten
          minutes, the build failed and the previous version is still live; publish again, and if
          it keeps failing, contact whoever runs the hosting.
        </p>
      </div>
    )
  }

  if (unpublished) {
    return (
      <div className="adm-publish adm-publish--pending" role="status">
        <p>
          <strong>You have unpublished changes.</strong> Last edit {when(changedAt!)}
          {changedBy ? ` by ${changedBy}` : ''}. Saved changes are not on the public site until
          you publish.
        </p>
        <PublishButton />
      </div>
    )
  }

  return (
    <div className="adm-publish adm-publish--live" role="status">
      <p>
        <strong>The public site is up to date.</strong>
        {liveAt ? ` Last published ${when(liveAt)}.` : ''}
      </p>
    </div>
  )
}
