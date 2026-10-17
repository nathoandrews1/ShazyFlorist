import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

let lenis: Lenis | null = null

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate })
  else window.scrollTo(0, 0)
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/** Buttery smooth scrolling via Lenis. Disabled for users who prefer reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let frame = requestAnimationFrame(function raf(time) {
      lenis?.raf(time)
      frame = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(frame)
      lenis?.destroy()
      lenis = null
    }
  }, [reduce])

  return <>{children}</>
}
