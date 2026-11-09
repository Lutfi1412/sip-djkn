interface Props<T extends string> {
  tabs: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}

/** Tab bergaya SIP: tab aktif memakai gradien brand #123A60 → #216BC4 */
export function Tabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  return (
    <div role="tablist" aria-label="Tampilan data kinerja" className="inline-flex max-w-full overflow-x-auto rounded-t-xl bg-white shadow-card">
      {tabs.map((t, i) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
              const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
              onChange(next.id)
              document.getElementById(`tab-${next.id}`)?.focus()
            }}
            className={`h-10 whitespace-nowrap px-5 text-xs font-medium transition-colors first:rounded-tl-xl last:rounded-tr-xl ${
              active
                ? 'bg-gradient-to-r from-navy to-brand font-semibold text-white'
                : 'text-panel-muted hover:bg-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
