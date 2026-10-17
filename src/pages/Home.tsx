import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useContent } from '../lib/content'
import { inBloom, monthRange, MONTHS } from '../lib/seasonal'
import { Page } from '../components/Page'
import { PetalCanvas } from '../components/PetalCanvas'
import { BlobBackground } from '../components/BlobBackground'
import { ParallaxImage } from '../components/ParallaxImage'
import { Reveal } from '../components/Reveal'
import { ButtonLink } from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'
import { ArrangementCard } from '../components/ArrangementCard'
import { Img } from '../components/Img'
import { Marquee, ScrollText, SpinningBadge, SplitHeading } from '../components/Decor'

export default function Home() {
  return (
    <Page>
      <Hero />
      <Marquee
        items={['Hand-tied bouquets', 'Wedding flowers', 'Event styling', 'Houseplants', 'Seasonal stems']}
        className="border-y border-forest/10 bg-blush/60 py-5 font-serif text-2xl italic text-forest md:text-3xl"
      />
      <Intro />
      <Categories />
      <Featured />
      <InBloom />
      <QuoteBand />
      <VisitCta />
    </Page>
  )
}

function Hero() {
  const { settings, arrangements } = useContent()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const smallImgY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  const second = arrangements.find((a) => a.featured && a.images[0] !== settings.heroImage) ?? arrangements[1]

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden">
      <BlobBackground />
      <PetalCanvas className="z-10" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pb-16 pt-32 md:grid-cols-12 md:px-10 md:pt-28">
        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }} className="relative z-20 md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-rose"
          >
            Florist &amp; flower studio
          </motion.p>
          <SplitHeading
            text={settings.heroHeading}
            delay={0.4}
            className="text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] text-forest"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg"
          >
            {settings.heroSubheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <ButtonLink to="/shop">Explore arrangements</ButtonLink>
            <ButtonLink to="/contact" variant="outline">
              Visit the studio
            </ButtonLink>
          </motion.div>
        </motion.div>

        <div className="relative md:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ParallaxImage
              picture={settings.heroImage}
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              strength={10}
              className="mx-auto aspect-[3/4] max-h-[72vh] w-full max-w-md rounded-t-full rounded-b-[2rem] shadow-[0_40px_80px_-30px_rgba(47,74,58,0.35)]"
            />
          </motion.div>

          {second && (
            <motion.div
              style={reduce ? undefined : { y: smallImgY }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 -left-4 z-20 hidden aspect-square w-40 overflow-hidden rounded-full border-[6px] border-cream shadow-xl md:block lg:-left-12 lg:w-48"
            >
              <Img picture={second.images[0]} sizes="200px" priority className="h-full w-full" />
            </motion.div>
          )}

          <SpinningBadge text="Fresh daily · Hand-tied · Made with love · " className="absolute -right-2 -top-6 z-20 lg:-right-10" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-forest/60 md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-forest/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-forest" />
        </span>
      </motion.div>
    </section>
  )
}

function Intro() {
  const { settings } = useContent()
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 md:grid-cols-12 md:px-10 md:py-40">
      <div className="md:col-span-7">
        <Reveal>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-rose">Our approach</p>
        </Reveal>
        <ScrollText
          text="We believe flowers should feel alive. Gathered by season, arranged by hand and made to bring a little joy to someone’s day."
          className="font-serif text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.1] text-forest"
        />
        <Reveal delay={0.1} className="mt-10">
          <ButtonLink to="/about" variant="outline">
            Read our story
          </ButtonLink>
        </Reveal>
      </div>
      <div className="relative md:col-span-5">
        <ParallaxImage
          picture={settings.aboutImage}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="aspect-[4/5] rounded-[2.5rem]"
          strength={14}
        />
        <div className="absolute -bottom-8 -right-3 rounded-3xl bg-cream px-7 py-5 shadow-xl md:-right-8">
          <p className="font-serif text-4xl text-rose-deep">100%</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Hand-arranged</p>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const { categories } = useContent()
  return (
    <section className="bg-ivory py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          eyebrow="What we make"
          title="Something for every moment"
          intro="From a single thank-you stem to a full wedding. Browse by occasion."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08} className={i % 2 ? 'lg:mt-16' : ''}>
              <Link to={`/shop?category=${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[2rem]">
                <Img
                  picture={c.cover}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-soft group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-forest-deep/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <h3 className="text-3xl">{c.title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/85 opacity-0 transition-all duration-500 ease-soft group-hover:max-h-24 group-hover:opacity-100">
                    {c.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { arrangements } = useContent()
  const featured = arrangements.filter((a) => a.featured).slice(0, 4)
  if (!featured.length) return null
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Customer favourites" title="Loved by many" align="left" />
        <Reveal className="mb-12 md:mb-16">
          <ButtonLink to="/shop" variant="outline">
            View all
          </ButtonLink>
        </Reveal>
      </div>
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {featured.map((a, i) => (
          <Reveal key={a.slug} delay={(i % 2) * 0.12} className={i % 2 ? 'sm:mt-24' : ''}>
            <ArrangementCard arrangement={a} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function InBloom() {
  const { seasonal } = useContent()
  const { month, upcoming, flowers } = inBloom(seasonal)
  if (!flowers.length) return null
  return (
    <section className="relative overflow-hidden bg-forest py-28 text-cream md:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-10 select-none font-serif text-[22vw] italic leading-none text-cream/[0.04]">
        {MONTHS[month - 1]}
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-blush">
            {upcoming ? `Coming in ${MONTHS[month - 1]}` : `In bloom this ${MONTHS[month - 1]}`}
          </p>
          <h2 className="text-4xl md:text-6xl">What’s in season</h2>
          <p className="mt-5 text-cream/70 md:text-lg">
            We follow the seasons, so our arrangements change through the year. Here’s what we’re loving right now.
          </p>
        </Reveal>
        <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
          {flowers.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08} className="w-[70vw] shrink-0 snap-start sm:w-[45vw] md:w-auto">
              <article className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl">
                  <Img
                    picture={f.image}
                    sizes="(min-width: 768px) 25vw, 70vw"
                    className="h-full w-full transition-transform duration-[1.4s] ease-soft group-hover:scale-110"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="text-3xl">{f.name}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-blush">{monthRange(f.months)}</span>
                </div>
                <p className="mt-2 text-sm text-cream/70">{f.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteBand() {
  const { arrangements } = useContent()
  const picture = arrangements.find((a) => a.category === 'weddings')?.images[0] ?? arrangements[0]?.images[0]
  if (!picture) return null
  return (
    <section className="relative">
      <ParallaxImage picture={picture} className="h-[80vh] min-h-[480px]" strength={18} />
      <div className="absolute inset-0 flex items-center justify-center bg-forest-deep/35 px-5">
        <Reveal className="max-w-3xl text-center text-cream">
          <p className="font-serif text-[clamp(2rem,4.5vw,4rem)] italic leading-[1.1]">
            “The flowers were beyond anything we imagined. Every guest asked who did them.”
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cream/80">Emma &amp; James, summer wedding</p>
        </Reveal>
      </div>
    </section>
  )
}

function VisitCta() {
  const { settings } = useContent()
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-40">
      <BlobBackground className="-z-10 opacity-70" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:px-10">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-rose">Come and say hello</p>
          <h2 className="text-5xl text-forest md:text-7xl">Visit the studio</h2>
          <p className="mt-6 max-w-md text-muted md:text-lg">
            Pop in to pick a bouquet, talk through your wedding flowers, or just to smell the roses. We’d love to see you.
          </p>
          <div className="mt-10">
            <ButtonLink to="/contact">Get directions</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="rounded-[2rem] bg-cream/80 p-8 shadow-[0_30px_60px_-30px_rgba(47,74,58,0.3)] backdrop-blur md:p-10">
          <h3 className="text-3xl text-forest">Opening hours</h3>
          <ul className="mt-6 divide-y divide-forest/10">
            {settings.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-muted">{h.days}</span>
                <span className="font-medium text-forest">{h.time}</span>
              </li>
            ))}
          </ul>
          <address className="mt-6 text-sm not-italic leading-relaxed text-muted">{settings.address.join(', ')}</address>
        </Reveal>
      </div>
    </section>
  )
}
