import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

export type Staff = {
  id: string
  name: string
  email: string
  role: string
  /** set for regional organisers; null for full admins */
  regionSlug: string | null
}

/**
 * The single gate for every admin surface.
 *
 * Middleware only checks that a session cookie exists — it cannot safely hit
 * the database on the edge. This runs on the server for real and is what
 * every admin page and every admin action must call. Never trust the
 * middleware alone.
 */
export async function requireStaff(): Promise<Staff> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/sign-in')

  const u = session.user as unknown as Staff
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? 'organiser',
    regionSlug: u.regionSlug ?? null,
  }
}

/** Full admins only — content and destructive operations. */
export async function requireAdmin(): Promise<Staff> {
  const staff = await requireStaff()
  if (staff.role !== 'admin') redirect('/admin?denied=1')
  return staff
}

/**
 * Regional organisers see only their own region's data. Returns null when the
 * caller may see everything, which callers treat as "no filter".
 */
export function regionScope(staff: Staff): string | null {
  return staff.role === 'admin' ? null : staff.regionSlug
}
