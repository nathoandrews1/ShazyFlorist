import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { Logo } from './Navbar'

export function Footer() {
  const { settings } = useContent()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-forest-deep text-cream/80">
      {/* Big outlined wordmark that slides by */}
      <div aria-hidden className="overflow-hidden border-b border-cream/10 py-8">
        <div className="animate-marquee flex w-max whitespace-nowrap font-serif text-[clamp(3rem,9vw,7rem)] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(251,247,242,0.25)]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex">
              {Array.from({ length: 4 }).map((_, j) => (
                <span key={j} className="px-8">
                  {settings.tagline} ✿
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <Logo name={settings.name} light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{settings.heroSubheading}</p>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.3em] text-blush">Visit</h3>
          <address className="text-sm not-italic leading-relaxed">
            {settings.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-4 space-y-1 text-sm">
            {settings.hours.map((h) => (
              <li key={h.days}>
                <span className="text-cream/60">{h.days}:</span> {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.3em] text-blush">Say hello</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-blush">
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-blush">
                {settings.email}
              </a>
            </li>
            {settings.instagram && (
              <li>
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-blush">
                  Instagram
                </a>
              </li>
            )}
            {settings.facebook && (
              <li>
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-blush">
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-cream/10 px-5 py-6 text-xs text-cream/50 sm:flex-row md:px-10">
        <p>
          © {year} {settings.name}
        </p>
        <nav className="flex gap-6">
          <Link to="/shop" className="hover:text-blush">
            Shop
          </Link>
          <Link to="/about" className="hover:text-blush">
            Our Story
          </Link>
          <Link to="/contact" className="hover:text-blush">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
