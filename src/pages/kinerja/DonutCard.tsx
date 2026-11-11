import { useState } from 'react'
import { Donut } from '../../components/charts/Donut'
import { fmtNum } from '../../lib/format'
import { Card } from './Card'

export interface LegendItem {
  label: string
  color: string
  value: number
  /** teks kecil di bawah label (rata kanan) */
  detail: string
}

interface Props {
  title: string
  subtitle: string
  items: LegendItem[]
  centerValue: string
  centerUnit: string
  ariaLabel: string
  /** persen tiap segmen untuk tampilan tengah saat hover */
  showPct?: boolean
  className?: string
}

/** Kartu donut + legenda. Hover pada segmen atau legenda saling tersinkron. */
export function DonutCard({ title, subtitle, items, centerValue, centerUnit, ariaLabel, showPct = true, className }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const total = items.reduce((a, b) => a + b.value, 0) || 1

  return (
    <Card title={title} subtitle={subtitle} className={className}>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <Donut
          ariaLabel={ariaLabel}
          segments={items.map((i) => ({ label: i.label, value: i.value, color: i.color }))}
          hovered={hover}
          onHover={setHover}
          center={(seg) =>
            seg ? (
              <>
                <p className="text-lg font-bold leading-none text-ink">
                  {showPct ? `${fmtNum((seg.value / total) * 100, 1)}%` : fmtNum(seg.value)}
                </p>
                <p className="mt-1 line-clamp-2 text-[9px] leading-tight text-panel-muted">{seg.label}</p>
              </>
            ) : (
              <>
                <p className="text-[22px] font-bold leading-none text-ink">{centerValue}</p>
                <p className="mt-1 text-[10px] text-panel-muted">{centerUnit}</p>
              </>
            )
          }
        />
        <ul className="w-full min-w-0 flex-1">
          {items.map((it, i) => (
            <li
              key={it.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={`cursor-default rounded-md border-b border-line px-1.5 py-1.5 transition-colors last:border-b-0 ${
                hover === i ? 'bg-subtle' : ''
              } ${hover !== null && hover !== i ? 'opacity-55' : ''}`}
            >
              <p className="flex items-center gap-2 text-xs font-bold text-ink">
                <span className="size-2 shrink-0 rounded-full" style={{ background: it.color }} />
                <span className="truncate">{it.label}</span>
              </p>
              <p className="mt-0.5 text-right text-[10px] text-panel-muted">{it.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
