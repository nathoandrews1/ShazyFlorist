import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { Arrangement, Category, Picture, SeasonalFlower, SiteContent, SiteSettings } from './types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production'

const isSanityConfigured = Boolean(projectId)

const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion: '2024-10-01', useCdn: true })
  : null

const builder = client ? imageUrlBuilder(client) : null

type SanityImage = SanityImageSource & { alt?: string; lqip?: string }

function toPicture(image: SanityImage | null | undefined, fallbackAlt: string): Picture {
  if (!image || !builder) {
    return { src: () => '', alt: fallbackAlt }
  }
  return {
    src: (w) => builder.image(image).width(w).auto('format').quality(80).fit('max').url(),
    alt: image.alt || fallbackAlt,
    lqip: image.lqip,
  }
}

const imageFields = `{..., "lqip": asset->metadata.lqip}`

const query = `{
  "settings": *[_type == "siteSettings"][0]{
    ..., heroImage${imageFields}, aboutImage${imageFields}
  },
  "categories": *[_type == "category"] | order(order asc, title asc){
    title, "slug": slug.current, description, cover${imageFields}
  },
  "arrangements": *[_type == "arrangement"] | order(order asc, name asc){
    name, "slug": slug.current, "category": category->slug.current, summary,
    description, flowers, priceFrom, featured, images[]${imageFields}
  },
  "seasonal": *[_type == "seasonalFlower"] | order(name asc){
    name, months, note, image${imageFields}
  }
}`

export async function fetchSanityContent(fallback: SiteContent): Promise<SiteContent> {
  if (!client) return fallback
  const raw: any = await client.fetch(query)
  const s = raw.settings ?? {}
  const fs = fallback.settings

  const settings: SiteSettings = {
    name: s.name ?? fs.name,
    tagline: s.tagline ?? fs.tagline,
    heroHeading: s.heroHeading ?? fs.heroHeading,
    heroSubheading: s.heroSubheading ?? fs.heroSubheading,
    heroImage: s.heroImage ? toPicture(s.heroImage, s.name ?? fs.name) : fs.heroImage,
    aboutHeading: s.aboutHeading ?? fs.aboutHeading,
    aboutText: s.aboutText?.length ? s.aboutText : fs.aboutText,
    aboutImage: s.aboutImage ? toPicture(s.aboutImage, 'Our studio') : fs.aboutImage,
    hours: s.hours?.length ? s.hours : fs.hours,
    address: s.address?.length ? s.address : fs.address,
    phone: s.phone ?? fs.phone,
    email: s.email ?? fs.email,
    currency: s.currency ?? fs.currency,
    instagram: s.instagram ?? fs.instagram,
    facebook: s.facebook ?? fs.facebook,
  }

  const categories: Category[] = (raw.categories ?? []).map((c: any) => ({
    slug: c.slug,
    title: c.title,
    description: c.description ?? '',
    cover: toPicture(c.cover, c.title),
  }))

  const arrangements: Arrangement[] = (raw.arrangements ?? []).map((a: any) => ({
    slug: a.slug,
    name: a.name,
    category: a.category ?? '',
    images: (a.images ?? []).map((i: SanityImage) => toPicture(i, a.name)),
    summary: a.summary ?? '',
    description: a.description ?? [],
    flowers: a.flowers ?? [],
    priceFrom: a.priceFrom ?? undefined,
    featured: Boolean(a.featured),
  }))

  const seasonal: SeasonalFlower[] = (raw.seasonal ?? []).map((f: any) => ({
    name: f.name,
    months: f.months ?? [],
    note: f.note ?? '',
    image: toPicture(f.image, f.name),
  }))

  // Until the owner has added content, keep showing the samples for that section.
  return {
    settings,
    categories: categories.length ? categories : fallback.categories,
    arrangements: arrangements.length ? arrangements : fallback.arrangements,
    seasonal: seasonal.length ? seasonal : fallback.seasonal,
  }
}
