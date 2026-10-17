import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

const styles = {
  solid: 'bg-forest text-cream hover:bg-forest-deep',
  outline: 'border border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-cream',
  light: 'bg-cream/90 text-forest backdrop-blur hover:bg-cream',
}

interface Props {
  to: string
  children: ReactNode
  variant?: keyof typeof styles
  className?: string
}

export function ButtonLink({ to, children, variant = 'solid', className = '' }: Props) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
