import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Deployed to https://<studioHost>.sanity.studio. Change if the name is taken.
  studioHost: 'shazys-florist',
})
