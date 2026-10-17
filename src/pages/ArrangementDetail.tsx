import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice, useContent } from '../lib/content'
import { Page } from '../components/Page'
import { Img } from '../components/Img'
import { Lightbox } from '../components/Lightbox'
import { Reveal } from '../components/Reveal'
import { ButtonLink } from '../components/Button'
import { ArrangementCard } from '../components/ArrangementCard'
import NotFound from './NotFound'

export default function ArrangementDetail() {
  const { slug } = useParams()
  const { arrangements, categories, settings } = useContent()
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const arrangement = arrangements.find((a) => a.slug === slug)
  if (!arrangement) return <NotFound />

  const category = categories.find((c) => c.slug === arrangement.category)
  const related = arrangements
    .filter((a) => a.slug !== arrangement.slug)
    .sort((a, b) => Number(b.category === arrangement.category) - Number(a.category === arrangement.category))
    .slice(0, 3)
  const images = arrangement.images

  return (
    <Page title={arrangement.name} description={arrangement.summary}>
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10 text-xs uppercase tracking-[0.2em] text-muted">
          <Link to="/shop" className="hover:text-rose">
            Shop
          </Link>
          {category && (
            <>
              <span className="mx-3">/</span>
              <Link to={`/shop?category=${category.slug}`} className="hover:text-rose">
                {category.title}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <button
              type="button"
              onClick={() => setLightbox(active)}
              className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[2.5rem]"
              aria-label="View larger image"
            >
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Img
                  picture={images[active]}
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="h-full w-full transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.03]"
                />
              </motion.div>
              <span className="absolute bottom-5 right-5 rounded-full bg-cream/90 px-4 py-2 text-xs tracking-wide text-forest backdrop-blur">
                Click to enlarge
              </span>
            </button>

            {images.length > 1 && (
              <div className="mt-5 flex gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === active}
                    className={`aspect-square w-20 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-cream transition-all md:w-24 ${
                      i === active ? 'ring-rose' : 'ring-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Img picture={img} sizes="100px" className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              {category && <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-rose">{category.title}</p>}
              <h1 className="text-5xl text-forest md:text-7xl">{arrangement.name}</h1>
              <p className="mt-5 font-serif text-2xl italic text-rose-deep">
                {formatPrice(arrangement.priceFrom, settings.currency)}
              </p>
              <p className="mt-8 text-lg leading-relaxed text-ink/80">{arrangement.summary}</p>
              {arrangement.description.map((para, i) => (
                <p key={i} className="mt-4 leading-relaxed text-muted">
                  {para}
                </p>
              ))}

              {arrangement.flowers.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.3em] text-forest">What’s inside</h2>
                  <ul className="flex flex-wrap gap-2">
                    {arrangement.flowers.map((f) => (
                      <li key={f} className="rounded-full bg-blush/60 px-4 py-2 text-sm text-forest">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 rounded-3xl border border-forest/10 bg-ivory p-6">
                <p className="text-sm leading-relaxed text-muted">
                  Every arrangement is made to order with the freshest seasonal stems, so yours may vary slightly from the
                  photos. Get in touch to order, or pop into the studio.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink to={`/contact?enquiry=${encodeURIComponent(arrangement.name)}`}>Enquire about this</ButtonLink>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center rounded-full px-5 py-3.5 text-sm text-forest underline-offset-4 hover:underline"
                  >
                    or call {settings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-ivory py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal>
              <h2 className="mb-14 text-4xl text-forest md:text-6xl">You may also love</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.1}>
                  <ArrangementCard arrangement={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox images={images} index={lightbox} onChange={setLightbox} />
    </Page>
  )
}
