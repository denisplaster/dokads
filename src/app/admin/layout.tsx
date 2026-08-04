import '@/styles/admin.css'

/**
 * Bare wrapper so /admin/sign-in can render without the authenticated shell.
 * Everything that requires a session lives under the (dash) route group,
 * whose layout calls requireStaff().
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
