import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const SINGLETONS = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: "Shazy's Florist",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Shop settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Shop settings')),
            S.divider(),
            S.documentTypeListItem('arrangement').title('Arrangements'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('seasonalFlower').title('In season'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    // Hide "create new" for the settings singleton.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
