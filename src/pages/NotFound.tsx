import { Page } from '../components/Page'
import { BlobBackground } from '../components/BlobBackground'
import { ButtonLink } from '../components/Button'

export default function NotFound() {
  return (
    <Page title="Page not found">
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 text-center">
        <BlobBackground className="-z-10" />
        <div>
          <p className="font-serif text-[clamp(6rem,20vw,14rem)] italic leading-none text-rose/60">404</p>
          <h1 className="mt-4 text-4xl text-forest md:text-6xl">This page has wilted</h1>
          <p className="mx-auto mt-5 max-w-md text-muted">
            We couldn’t find what you were looking for. Perhaps it’s out of season.
          </p>
          <div className="mt-10">
            <ButtonLink to="/">Back to the home page</ButtonLink>
          </div>
        </div>
      </section>
    </Page>
  )
}
