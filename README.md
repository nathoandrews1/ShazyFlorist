# Shazy's Florist

A storefront website for Shazy's Florist, built as a React single-page app with Vite, Tailwind CSS v4, Framer Motion and Lenis. Content is managed in a Sanity Studio. Visitors can browse but not buy: there is no checkout and no user accounts.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Without any configuration, the site uses the built-in sample content in `src/data/sample.ts` (Unsplash photos).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Project layout

```
src/
  pages/        Home, Shop, ArrangementDetail, About, Contact, NotFound
  components/   PetalCanvas, ParallaxImage, Reveal, Page (transitions + SEO), Navbar, Footer…
  lib/          content provider, Sanity client + query, seasonal helpers, types
  data/         sample content used until Sanity is connected
studio/         Sanity Studio (the content editor)
wrangler.jsonc  Cloudflare config (static assets + SPA routing)
```

## Connecting Sanity (content editing)

1. Create a free account at [sanity.io](https://www.sanity.io) and create a project, or run `npx sanity init` inside `studio/` and choose "create new project".
2. Copy `studio/.env.example` to `studio/.env` and fill in `SANITY_STUDIO_PROJECT_ID`.
3. Run the Studio:
   ```bash
   cd studio
   npm install
   npm run dev       # http://localhost:3333
   npm run deploy    # publishes it to https://shazys-florist.sanity.studio
   ```
4. Copy `.env.example` to `.env` in the project root and set `VITE_SANITY_PROJECT_ID`.
5. In [sanity.io/manage](https://www.sanity.io/manage), open **API → CORS origins** and add `http://localhost:5173` and your live site URL.

Until a section has content in Sanity, the site keeps showing the sample content for that section, so you can migrate gradually. Content changes go live as soon as you publish them in the Studio. No redeploy is needed.

## Contact form

The form posts to [Web3Forms](https://web3forms.com) (free, no server). Get an access key with the shop's email address and set `VITE_WEB3FORMS_KEY`. Without a key, the form opens the visitor's email app instead.

## Deploying to Cloudflare

Hosted as static assets on Cloudflare, configured by `wrangler.jsonc`. Its `not_found_handling: single-page-application` setting sends every path to `index.html`, so deep links like `/shop/the-wild-romantic` work.

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create application → Import a repository** and pick the repo.
3. Use these settings (skip "auto-generate config", as `wrangler.jsonc` already exists):
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
4. Under **Variables**, add `NODE_VERSION` = `22`, plus `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET` and `VITE_WEB3FORMS_KEY` when you have them.
5. Add a custom domain under **Settings → Domains & Routes**.

Every push to `main` redeploys automatically.

## Accessibility and motion

All animations respect the visitor's "reduce motion" setting. With it on, smooth scrolling and the petal canvas are disabled and transitions become instant.
