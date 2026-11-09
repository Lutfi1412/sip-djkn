interface Entry {
  name?: unknown
  value?: unknown
  color?: string
  dataKey?: unknown
}

export interface TipProps {
  active?: boolean
  label?: string | number
  payload?: readonly Entry[]
}

/** Tooltip Recharts bergaya SIP */
export function ChartTooltip({
  active,
  label,
  payload,
  rows,
}: TipProps & { rows: (e: Entry) => { name: string; value: string; color?: string } | null }) {
  if (!active || !payload?.length) return null
  const items = payload.map(rows).filter((x): x is NonNullable<typeof x> => x !== null)
  if (!items.length) return null
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-pop">
      <p className="mb-1 font-bold text-ink">{label}</p>
      {items.map((it) => (
        <p key={it.name} className="flex items-center gap-2 text-panel-muted">
          <span className="size-2 rounded-full" style={{ background: it.color }} />
          {it.name}: <span className="font-semibold text-ink">{it.value}</span>
        </p>
      ))}
    </div>
  )
}
