import { useContent } from '../lib/content'
import { Page } from '../components/Page'
import { BlobBackground } from '../components/BlobBackground'
import { ParallaxImage } from '../components/ParallaxImage'
import { Reveal } from '../components/Reveal'
import { ButtonLink } from '../components/Button'
import { SplitHeading } from '../components/Decor'

const values = [
  {
    title: 'Seasonal & local',
    text: 'We buy what’s at its best right now, and from British growers whenever we can. Fewer air miles, more scent.',
  },
  {
    title: 'Made by hand',
    text: 'No production line. Every bouquet is designed and tied by hand in our studio, one stem at a time.',
  },
  {
    title: 'Kind to the planet',
    text: 'Floral foam-free, compostable wrapping, and leftover stems donated to local care homes.',
  },
]

export default function About() {
  const { settings, arrangements } = useContent()
  const band = arrangements.find((a) => a.category === 'weddings')?.images[1] ?? settings.heroImage

  return (
    <Page title="Our Story" description={settings.aboutText[0]}>
      <section className="relative isolate overflow-hidden pb-20 pt-40 md:pt-48">
        <BlobBackground className="-z-10" />
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-rose">Our story</p>
          <SplitHeading text={settings.aboutHeading} className="max-w-4xl text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-forest" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 pb-28 md:grid-cols-12 md:px-10 md:pb-40">
        <div className="md:col-span-6">
          <ParallaxImage
            picture={settings.aboutImage}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] rounded-t-full rounded-b-[2.5rem]"
            strength={12}
          />
        </div>
        <div className="flex flex-col justify-center md:col-span-6 md:pl-8">
          {settings.aboutText.map((para, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p
                className={
                  i === 0
                    ? 'mb-8 font-serif text-3xl leading-snug text-forest md:text-4xl'
                    : 'mb-6 text-lg leading-relaxed text-muted'
                }
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest py-28 text-cream md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-blush">What we stand for</p>
            <h2 className="mb-16 max-w-2xl text-4xl md:text-6xl">Small studio, big heart</h2>
          </Reveal>
          <div className="grid gap-12 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.12} className="border-t border-cream/20 pt-8">
                <span className="font-serif text-5xl italic text-blush/60">0{i + 1}</span>
                <h3 className="mt-4 text-3xl">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-cream/70">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ParallaxImage picture={band} className="h-[70vh] min-h-[420px]" strength={18} />

      <section className="px-5 py-28 text-center md:px-10 md:py-36">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-4xl text-forest md:text-6xl">Let’s make something beautiful</h2>
          <p className="mx-auto mt-6 max-w-lg text-muted md:text-lg">
            Planning a wedding, an event, or just want to brighten someone’s day? We’d love to hear from you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/contact">Get in touch</ButtonLink>
            <ButtonLink to="/shop" variant="outline">
              Browse the shop
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}
