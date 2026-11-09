import type { ReactNode } from 'react'

export function Card({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-card ${className}`}>
      {title && <h3 className="text-[15px] font-bold text-ink">{title}</h3>}
      {subtitle && <p className="mt-0.5 text-xs text-panel-muted">{subtitle}</p>}
      <div className={title ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}
