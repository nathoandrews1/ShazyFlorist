import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Picture } from '../lib/types'
import { setScrollLocked } from './SmoothScroll'

interface Props {
  images: Picture[]
  index: number | null
  onChange: (index: number | null) => void
}

const navButton =
  'absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 sm:flex'

export function Lightbox({ images, index, onChange }: Props) {
  const open = index !== null
  const count = images.length

  useEffect(() => {
    if (index === null) return
    setScrollLocked(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange((index + 1) % count)
      if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      setScrollLocked(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [index, count, onChange])

  const go = (delta: number) => index !== null && onChange((index + delta + count) % count)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/95 p-4 backdrop-blur"
          onClick={() => onChange(null)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index].src(1800)}
              alt={images[index].alt}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              drag={count > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1)
                else if (info.offset.x > 80) go(-1)
              }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full cursor-grab rounded-2xl object-contain shadow-2xl active:cursor-grabbing"
            />
          </AnimatePresence>

          <button
            type="button"
            aria-label="Close"
            onClick={() => onChange(null)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20"
          >
            ×
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                className={`${navButton} left-4`}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                className={`${navButton} right-4`}
              >
                →
              </button>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm tracking-widest text-cream/70">
                {index + 1} / {count}
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
