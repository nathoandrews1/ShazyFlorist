import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../lib/content'
import { setScrollLocked } from './SmoothScroll'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Visit & Contact' },
]

export function Logo({ name, light = false }: { name: string; light?: boolean }) {
  const [first, ...rest] = name.split(' ')
  return (
    <span className={`flex items-baseline gap-2 ${light ? 'text-cream' : 'text-forest'}`}>
      <span className="font-serif text-3xl italic leading-none">{first}</span>
      {rest.length > 0 && <span className="text-[0.65rem] font-medium uppercase tracking-[0.35em]">{rest.join(' ')}</span>}
    </span>
  )
}

export function Navbar() {
  const { settings } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    setScrollLocked(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow] duration-500 ${
          scrolled && !open ? 'bg-cream/75 shadow-[0_1px_0_rgba(47,74,58,0.08)] backdrop-blur-lg' : 'bg-transparent'
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-10 ${
            scrolled ? 'py-3' : 'py-6'
          }`}
        >
          <Link to="/" aria-label={`${settings.name} home`} className="relative z-10">
            <Logo name={settings.name} />
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `group relative text-sm tracking-wide text-forest transition-colors hover:text-rose ${isActive ? 'text-rose' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-rose transition-transform duration-500 ease-soft ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-px w-6 bg-forest transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-forest transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </nav>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise make it the
          containing block for this fixed overlay, shrinking it to the header's height. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-blush px-8 md:hidden"
          >
            <motion.ul exit={{ opacity: 0, transition: { duration: 0.2 } }} className="space-y-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) => `font-serif text-5xl ${isActive ? 'italic text-rose-deep' : 'text-forest'}`}
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.75 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="mt-14 text-sm text-forest/70"
            >
              {settings.phone}
              <br />
              {settings.email}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
