import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useContent } from '../lib/content'
import { Page } from '../components/Page'
import { BlobBackground } from '../components/BlobBackground'
import { AnimatedArrangementCard } from '../components/ArrangementCard'
import { SplitHeading } from '../components/Decor'

export default function Shop() {
  const { arrangements, categories } = useContent()
  const [params, setParams] = useSearchParams()
  const active = params.get('category') ?? 'all'
  const activeCategory = categories.find((c) => c.slug === active)
  const visible = active === 'all' ? arrangements : arrangements.filter((a) => a.category === active)

  const select = (slug: string) => {
    setParams(slug === 'all' ? {} : { category: slug }, { replace: true, preventScrollReset: true })
  }

  const filters = [{ slug: 'all', title: 'Everything' }, ...categories]

  return (
    <Page title="Shop" description="Browse our bouquets, wedding flowers, event styling and houseplants.">
      <section className="relative isolate overflow-hidden pb-16 pt-40 md:pt-48">
        <BlobBackground className="-z-10" />
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-rose">The collection</p>
          <SplitHeading text="Arrangements & gifts" className="text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-forest" />
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-6 max-w-xl text-muted md:text-lg"
            >
              {activeCategory?.description ??
                'Everything here is made to order with the best seasonal stems, so each piece is a little different. Get in touch to order or ask a question.'}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-32 md:px-10">
        <LayoutGroup>
          <div role="group" aria-label="Filter by category" className="mb-14 flex flex-wrap gap-3">
            {filters.map((f) => {
              const selected = f.slug === active
              return (
                <button
                  key={f.slug}
                  aria-pressed={selected}
                  onClick={() => select(f.slug)}
                  className={`relative isolate rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 ${
                    selected ? 'border-forest text-cream' : 'border-forest/20 text-forest hover:border-forest/50'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-forest"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{f.title}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:nth-child(3n+2)]:translate-y-20">
          <AnimatePresence mode="popLayout">
            {visible.map((a) => (
              <AnimatedArrangementCard key={a.slug} arrangement={a} />
            ))}
          </AnimatePresence>
        </motion.div>

        {!visible.length && <p className="py-20 text-center text-muted">Nothing here just yet. Check back soon.</p>}
      </section>
    </Page>
  )
}
