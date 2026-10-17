import { Reveal } from './Reveal'

interface Props {
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, intro, align = 'center' }: Props) {
  const centred = align === 'center'
  return (
    <Reveal className={`mb-12 md:mb-16 ${centred ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}`}>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-rose">{eyebrow}</p>
      <h2 className="text-4xl text-forest md:text-6xl">{title}</h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">{intro}</p>}
    </Reveal>
  )
}
