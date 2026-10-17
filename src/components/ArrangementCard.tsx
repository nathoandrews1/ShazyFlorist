import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Img } from './Img'
import { formatPrice, useContent } from '../lib/content'
import type { Arrangement } from '../lib/types'

const ASPECTS = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[2/3]']

interface Props {
  arrangement: Arrangement
  index?: number
  /** Vary image heights for a masonry rhythm. */
  varied?: boolean
}

export function ArrangementCard({ arrangement, index = 0, varied = false }: Props) {
  const { settings, categories } = useContent()
  const category = categories.find((c) => c.slug === arrangement.category)
  const aspect = varied ? ASPECTS[index % ASPECTS.length] : 'aspect-[4/5]'

  return (
    <Link to={`/shop/${arrangement.slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-[2rem] ${aspect}`}>
        <Img
          picture={arrangement.images[0]}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-cream text-forest opacity-0 transition-all duration-500 ease-soft group-hover:translate-y-0 group-hover:opacity-100">
          →
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          {category && <p className="mb-1 text-[0.7rem] uppercase tracking-[0.25em] text-rose">{category.title}</p>}
          <h3 className="text-2xl text-forest transition-colors group-hover:text-rose-deep md:text-3xl">{arrangement.name}</h3>
        </div>
        <p className="shrink-0 pt-1 text-sm text-muted">{formatPrice(arrangement.priceFrom, settings.currency)}</p>
      </div>
    </Link>
  )
}

/** Card wrapped for animated grid layouts (filtering). */
export function AnimatedArrangementCard(props: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ArrangementCard {...props} />
    </motion.div>
  )
}
