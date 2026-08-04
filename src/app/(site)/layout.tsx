import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

/**
 * The public site's chrome. The admin sits outside this group so it does not
 * inherit the zine navigation and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
