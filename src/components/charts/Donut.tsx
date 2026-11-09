import type { ReactNode } from 'react'

export interface DonutSeg {
  label: string
  value: number
  color: string
}

interface Props {
  segments: DonutSeg[]
  size?: number
  thickness?: number
  hovered: number | null
  onHover: (i: number | null) => void
  /** isi tengah donut; menerima segmen yang sedang di-hover */
  center: (seg: DonutSeg | null) => ReactNode
  ariaLabel: string
}

/** Donut SVG ringan dengan interaksi hover (segmen membesar, lainnya meredup, tengah berubah). */
export function Donut({ segments, size = 156, thickness = 18, hovered, onHover, center, ariaLabel }: Props) {
  const mid = size / 2
  const ringR = mid - 2
  const r = ringR - 10 - thickness / 2
  const C = 2 * Math.PI * r
  const total = segments.reduce((a, s) => a + s.value, 0) || 1
  const gap = segments.length > 1 ? 3 : 0

  let cum = 0
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={ariaLabel}>
        <circle cx={mid} cy={mid} r={ringR} fill="#eef3fb" />
        <circle cx={mid} cy={mid} r={r} fill="#fff" />
        <g transform={`rotate(-90 ${mid} ${mid})`}>
          {segments.map((s, i) => {
            const len = (s.value / total) * C
            const dash = Math.max(0, len - gap)
            const offset = -(cum + gap / 2)
            cum += len
            const active = hovered === i
            return (
              <circle
                key={s.label}
                cx={mid}
                cy={mid}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={active ? thickness + 5 : thickness}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={offset}
                opacity={hovered === null || active ? 1 : 0.4}
                style={{ transition: 'stroke-width .2s, opacity .2s', cursor: 'pointer' }}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
              />
            )
          })}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div className="max-w-[88px]">{center(hovered === null ? null : segments[hovered])}</div>
      </div>
    </div>
  )
}
