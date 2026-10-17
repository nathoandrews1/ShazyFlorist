import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../lib/content'
import { Page } from '../components/Page'
import { BlobBackground } from '../components/BlobBackground'
import { Reveal } from '../components/Reveal'
import { SplitHeading } from '../components/Decor'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

const occasions = ['General enquiry', 'Bouquet / gift', 'Wedding', 'Event', 'Sympathy', 'Something else']

const field =
  'w-full rounded-2xl border border-forest/15 bg-cream/70 px-5 py-4 text-ink placeholder:text-muted/60 transition focus:border-rose focus:bg-cream focus:outline-none'
const label = 'mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-forest'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const { settings } = useContent()
  const [params] = useSearchParams()
  const enquiry = params.get('enquiry')
  const [status, setStatus] = useState<Status>('idle')

  const mapQuery = encodeURIComponent(settings.address.join(', '))

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>

    // Without a form service configured, hand off to the visitor's email app.
    if (!WEB3FORMS_KEY) {
      const body = `${data.message}\n\nName: ${data.name}\nPhone: ${data.phone || '-'}\nDate needed: ${data.date || '-'}`
      window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent(data.occasion)}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New enquiry: ${data.occasion}`,
          from_name: settings.name,
          ...data,
        }),
      })
      const json = await res.json()
      setStatus(json.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Page title="Visit & Contact" description={`Find us at ${settings.address.join(', ')}. Call ${settings.phone}.`}>
      <section className="relative isolate overflow-hidden pb-16 pt-40 md:pt-48">
        <BlobBackground className="-z-10" />
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-rose">Visit & contact</p>
          <SplitHeading text="Let’s talk flowers" className="text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-forest" />
          <p className="mt-6 max-w-xl text-muted md:text-lg">
            Ordering a bouquet, planning a wedding, or just have a question? Send us a message, give us a call, or pop in.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 md:px-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ivory p-7 md:p-12">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                    className="font-serif text-7xl text-rose"
                  >
                    ✿
                  </motion.span>
                  <h2 className="mt-6 text-4xl text-forest">Thank you!</h2>
                  <p className="mt-4 max-w-sm text-muted">We’ve received your message and will be in touch very soon.</p>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0, y: -20 }} onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
                  <h2 className="text-3xl text-forest sm:col-span-2 md:text-4xl">Send us a message</h2>
                  <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                  <div>
                    <label htmlFor="name" className={label}>Name</label>
                    <input id="name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className={label}>Email</label>
                    <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className={label}>Phone <span className="normal-case tracking-normal text-muted">(optional)</span></label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="For a quick reply" />
                  </div>
                  <div>
                    <label htmlFor="date" className={label}>Date needed <span className="normal-case tracking-normal text-muted">(optional)</span></label>
                    <input id="date" name="date" type="date" className={field} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="occasion" className={label}>Occasion</label>
                    <select id="occasion" name="occasion" className={field} defaultValue={enquiry ? 'Bouquet / gift' : occasions[0]}>
                      {occasions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className={label}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className={`${field} resize-none`}
                      defaultValue={enquiry ? `Hi, I’d love to know more about “${enquiry}”.` : ''}
                      placeholder="Tell us what you have in mind: colours, budget, who it’s for…"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-forest-deep disabled:opacity-60"
                    >
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                    {status === 'error' && (
                      <p role="alert" className="text-sm text-rose-deep">
                        Something went wrong. Please try again or email us at {settings.email}.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="space-y-6 lg:col-span-5">
          <Reveal delay={0.1} className="rounded-[2.5rem] bg-forest p-8 text-cream md:p-10">
            <h2 className="text-3xl">Find us</h2>
            <address className="mt-5 not-italic leading-relaxed text-cream/80">
              {settings.address.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-blush underline-offset-4 hover:underline"
            >
              Get directions →
            </a>
            <div className="mt-8 space-y-2 border-t border-cream/15 pt-8">
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="block font-serif text-2xl hover:text-blush">
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="block text-cream/80 hover:text-blush">
                {settings.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="rounded-[2.5rem] bg-blush/50 p-8 md:p-10">
            <h2 className="text-3xl text-forest">Opening hours</h2>
            <ul className="mt-5 divide-y divide-forest/10">
              {settings.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-muted">{h.days}</span>
                  <span className="font-medium text-forest">{h.time}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Reveal className="mx-auto max-w-7xl px-5 pb-32 md:px-10">
        <div className="overflow-hidden rounded-[2.5rem] shadow-[0_30px_60px_-30px_rgba(47,74,58,0.3)]">
          <iframe
            title={`Map showing ${settings.name}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-[420px] w-full border-0 [filter:sepia(0.25)_saturate(0.8)_hue-rotate(-10deg)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </Page>
  )
}
