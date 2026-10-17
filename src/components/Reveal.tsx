import { motion, type HTMLMotionProps } from 'framer-motion'

interface Props extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
}

/** Fades and lifts its children into view the first time they scroll into the viewport. */
export function Reveal({ delay = 0, y = 40, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
