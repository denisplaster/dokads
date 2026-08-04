import { getAllRegions, getRegionEventCounts } from '@/db/queries'
import { RegionForm } from '@/components/admin/RegionForm'

export const dynamic = 'force-dynamic'

export default async function AdminRegions() {
  const [rows, counts] = await Promise.all([getAllRegions(), getRegionEventCounts()])
  const live = rows.filter((r) => r.status !== 'interest')

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Regions</h1>
          <p>
            {live.length} published, {rows.length - live.length} gathering interest.
          </p>
        </div>
      </div>

      <p className="adm-note">
        <strong>A region only gets a public page once real organisers exist.</strong> That rule is
        enforced when you save, not just written on the site — setting a region to forming or
        active without an organiser is rejected.
      </p>

      <div className="adm-card">
        <h2>Add a region</h2>
        <RegionForm />
      </div>

      {rows.map((r) => (
        <div className="adm-card" key={r.slug}>
          <div className="adm-head" style={{ marginBottom: 'var(--s-2)', paddingBottom: 0, borderBottom: 0 }}>
            <div>
              <strong>{r.name}</strong>
              <span className="adm-table__sub">
                {r.country} · {r.status} · {counts[r.slug] ?? 0} public event
                {(counts[r.slug] ?? 0) === 1 ? '' : 's'} ·{' '}
                {r.organisers?.length ?? 0} organiser{(r.organisers?.length ?? 0) === 1 ? '' : 's'}
              </span>
            </div>
            <RegionForm region={r} />
          </div>
        </div>
      ))}
    </>
  )
}
