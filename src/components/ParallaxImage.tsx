import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Img } from './Img'
import type { Picture } from '../lib/types'

interface Props {
  picture: Picture
  className?: string
  sizes?: string
  /** How far the image drifts as it crosses the viewport, as a % of its height. */
  strength?: number
  priority?: boolean
}

/** An image that moves slower than the page as you scroll, inside a clipping frame. */
export function ParallaxImage({ picture, className = '', sizes, strength = 12, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // The layer is (100 + 2 * strength)% tall, so translate by a % of its own height that
  // maps back to exactly `strength`% of the frame.
  const shift = strength / (1 + (2 * strength) / 100)
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Oversized layer so the drift never reveals an edge */}
      <motion.div className="absolute inset-x-0" style={{ top: `-${strength}%`, bottom: `-${strength}%`, y: reduce ? 0 : y }}>
        <Img picture={picture} sizes={sizes} priority={priority} className="h-full w-full" />
      </motion.div>
    </div>
  )
}
