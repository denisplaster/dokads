import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Start } from './pages/Start'
import { AmIaDokad } from './pages/AmIaDokad'
import { Learn } from './pages/Learn'
import { Stories } from './pages/Stories'
import { StoryPage } from './pages/StoryPage'
import { Events } from './pages/Events'
import { EventPage } from './pages/EventPage'
import { Regions } from './pages/Regions'
import { RegionPage } from './pages/RegionPage'
import { Resources } from './pages/Resources'
import { Join } from './pages/Join'
import { About } from './pages/About'
import { Guidelines } from './pages/Guidelines'
import { Share } from './pages/Share'
import { Privacy } from './pages/Privacy'
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/am-i-a-dokad" element={<AmIaDokad />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventPage />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/regions/:slug" element={<RegionPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/join" element={<Join />} />
          <Route path="/about" element={<About />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/share" element={<Share />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
