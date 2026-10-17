import { useState } from 'react'
import type { Picture } from '../lib/types'

const WIDTHS = [400, 700, 1000, 1400, 2000]

interface Props {
  picture: Picture
  sizes?: string
  className?: string
  /** Load immediately (e.g. hero images). */
  priority?: boolean
}

/** Responsive image with srcset, lazy loading and a soft fade-in over its blur placeholder. */
export function Img({ picture, sizes = '100vw', className = '', priority = false }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={picture.src(1000)}
      srcSet={WIDTHS.map((w) => `${picture.src(w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={picture.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onLoad={() => setLoaded(true)}
      style={picture.lqip ? { backgroundImage: `url(${picture.lqip})`, backgroundSize: 'cover' } : undefined}
      className={`bg-blush/40 object-cover transition-[opacity,filter] duration-700 ${
        loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
      } ${className}`}
    />
  )
}
