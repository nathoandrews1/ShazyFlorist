import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { scrollToTop } from './components/SmoothScroll'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ArrangementDetail from './pages/ArrangementDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <div className="grain">
      <a
        href="#content"
        className="fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-forest px-5 py-3 text-sm text-cream focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <div id="content">
        {/* Keyed by path (not query) so filtering the shop doesn't trigger a page transition. */}
        <AnimatePresence mode="wait" onExitComplete={() => scrollToTop()}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ArrangementDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}
