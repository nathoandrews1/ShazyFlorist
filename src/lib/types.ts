/** An image from any source (Sanity CDN or a sample URL), resolvable at any width. */
export interface Picture {
  src: (width: number) => string
  alt: string
  /** Tiny base64 blur placeholder, if available. */
  lqip?: string
}

export interface Category {
  slug: string
  title: string
  description: string
  cover: Picture
}

export interface Arrangement {
  slug: string
  name: string
  category: string
  images: Picture[]
  summary: string
  description: string[]
  flowers: string[]
  priceFrom?: number
  featured: boolean
}

export interface SeasonalFlower {
  name: string
  image: Picture
  /** 1 = January … 12 = December */
  months: number[]
  note: string
}

export interface OpeningHours {
  days: string
  time: string
}

export interface SiteSettings {
  name: string
  tagline: string
  heroHeading: string
  heroSubheading: string
  heroImage: Picture
  aboutHeading: string
  aboutText: string[]
  aboutImage: Picture
  hours: OpeningHours[]
  address: string[]
  phone: string
  email: string
  currency: string
  instagram?: string
  facebook?: string
}

export interface SiteContent {
  settings: SiteSettings
  categories: Category[]
  arrangements: Arrangement[]
  seasonal: SeasonalFlower[]
}
