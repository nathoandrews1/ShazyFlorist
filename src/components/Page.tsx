import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useContent } from '../lib/content'

const ease = [0.76, 0, 0.24, 1] as const
const curtain = 'pointer-events-none fixed inset-0 z-[70] bg-blush'

interface Props {
  title?: string
  description?: string
  children: ReactNode
}

/** Wraps each route: sets the document title/meta and plays the curtain transition. */
export function Page({ title, description, children }: Props) {
  const { settings } = useContent()
  const fullTitle = title ? `${title} · ${settings.name}` : `${settings.name} · ${settings.tagline}`
  const desc = description ?? settings.heroSubheading

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
      </Helmet>

      {/* Rises to cover the old page on exit… */}
      <motion.div
        aria-hidden
        className={`${curtain} origin-bottom`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease }}
      />
      {/* …then lifts away to reveal the new one. */}
      <motion.div
        aria-hidden
        className={`${curtain} origin-top`}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease, delay: 0.05 }}
      />

      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        {children}
      </motion.main>
    </>
  )
}
