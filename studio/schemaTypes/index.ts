import { defineArrayMember, defineField, defineType } from 'sanity'

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [defineField({ name: 'alt', title: 'Description (for accessibility)', type: 'string' })],
  })

const orderField = defineField({
  name: 'order',
  title: 'Sort order',
  type: 'number',
  description: 'Lower numbers appear first.',
})

const arrangement = defineType({
  name: 'arrangement',
  title: 'Arrangement',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }], validation: (r) => r.required() }),
    defineField({
      name: 'images',
      type: 'array',
      of: [defineArrayMember({ ...imageWithAlt('image', 'Image') })],
      description: 'The first image is used as the cover.',
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'summary', type: 'string', description: 'One line shown under the title.' }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'text', rows: 3 }], description: 'Paragraphs.' }),
    defineField({ name: 'flowers', title: 'What’s inside', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'priceFrom', title: 'Price from', type: 'number', description: 'Leave blank to show “Price on request”.' }),
    defineField({ name: 'featured', title: 'Feature on home page', type: 'boolean', initialValue: false }),
    orderField,
  ],
  preview: { select: { title: 'name', subtitle: 'category.title', media: 'images.0' } },
})

const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    imageWithAlt('cover', 'Cover image'),
    orderField,
  ],
  preview: { select: { title: 'title', media: 'cover' } },
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const seasonalFlower = defineType({
  name: 'seasonalFlower',
  title: 'Seasonal flower',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    imageWithAlt('image', 'Image'),
    defineField({
      name: 'months',
      title: 'In season',
      type: 'array',
      of: [{ type: 'number' }],
      options: { list: MONTHS.map((title, i) => ({ title, value: i + 1 })), layout: 'grid' },
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'note', type: 'string' }),
  ],
  preview: { select: { title: 'name', subtitle: 'note', media: 'image' } },
})

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Shop settings',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home page', default: true },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact & hours' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Shop name', type: 'string', group: 'home' }),
    defineField({ name: 'tagline', type: 'string', group: 'home' }),
    defineField({ name: 'heroHeading', title: 'Hero heading', type: 'string', group: 'home' }),
    defineField({ name: 'heroSubheading', title: 'Hero text', type: 'text', rows: 2, group: 'home' }),
    { ...imageWithAlt('heroImage', 'Hero image'), group: 'home' },
    defineField({ name: 'aboutHeading', title: 'About heading', type: 'string', group: 'about' }),
    defineField({ name: 'aboutText', title: 'Our story', type: 'array', of: [{ type: 'text', rows: 4 }], group: 'about' }),
    { ...imageWithAlt('aboutImage', 'About image'), group: 'about' },
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'days', type: 'string', description: 'e.g. Monday – Friday' }),
            defineField({ name: 'time', type: 'string', description: 'e.g. 9:00 – 18:00, or Closed' }),
          ],
          preview: { select: { title: 'days', subtitle: 'time' } },
        }),
      ],
    }),
    defineField({ name: 'address', title: 'Address lines', type: 'array', of: [{ type: 'string' }], group: 'contact' }),
    defineField({ name: 'phone', type: 'string', group: 'contact' }),
    defineField({ name: 'email', type: 'string', group: 'contact' }),
    defineField({ name: 'currency', title: 'Currency symbol', type: 'string', initialValue: '£', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url', group: 'contact' }),
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url', group: 'contact' }),
  ],
  preview: { prepare: () => ({ title: 'Shop settings' }) },
})

export const schemaTypes = [siteSettings, arrangement, category, seasonalFlower]
