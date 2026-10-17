import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { sampleContent } from '../data/sample'
import type { SiteContent } from './types'

const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)

const ContentContext = createContext<SiteContent>(sampleContent)

/**
 * Loads all site content once. The site is small enough that a single query is
 * cheaper than per-page fetching, and it makes route transitions instant.
 * Without a Sanity project configured, the sample content is used directly.
 */
export function ContentProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(isSanityConfigured ? null : sampleContent)

  useEffect(() => {
    if (!isSanityConfigured) return
    // Loaded on demand so the Sanity client isn't in the bundle until it's needed.
    import('./sanity')
      .then(({ fetchSanityContent }) => fetchSanityContent(sampleContent))
      .then(setContent)
      .catch((err) => {
        console.error('Failed to load content from Sanity, using sample content.', err)
        setContent(sampleContent)
      })
  }, [])

  if (!content) return <>{fallback}</>
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)

export function formatPrice(amount: number | undefined, currency: string) {
  return amount == null ? 'Price on request' : `From ${currency}${amount}`
}
