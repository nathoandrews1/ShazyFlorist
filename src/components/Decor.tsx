import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/** Splits a heading into words that slide up out of a mask one after another. */
export function SplitHeading({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <h1 className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/** A circular line of text that slowly rotates — a little stamp/badge. */
export function SpinningBadge({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`h-32 w-32 rounded-full bg-cream/80 shadow-lg backdrop-blur ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_18s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-forest font-sans text-[7.4px] uppercase tracking-[0.2em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl text-rose">✿</span>
    </div>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}

/** Large statement text whose words light up one by one as it scrolls through the viewport. */
export function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

/** Endless horizontal ribbon of words. */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-8">{item}</span>
          <span className="text-rose">✿</span>
        </span>
      ))}
    </span>
  )
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div className="animate-marquee flex w-max">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  )
}
