import { useState } from 'react'
import mapData from '../../data/indonesiaMap.json'
import { WILAYAH } from '../../data/kinerjaData'
import { fmtNum } from '../../lib/format'
import { Card } from './Card'

interface Province {
  name: string
  d: string
  cx: number
  cy: number
}
const provinces = mapData.provinces as Province[]
const byName = new Map(provinces.map((p) => [p.name, p]))

/** Posisi label callout pada viewBox peta (x,y = pojok kiri-atas badge) */
const BADGE: Record<string, { x: number; y: number }> = {
  A: { x: 22, y: 152 },
  B: { x: 138, y: 262 },
  C: { x: 290, y: 266 },
  D: { x: 404, y: 44 },
}
const BW = 98
const BH = 26

export function RegionMap() {
  const [hover, setHover] = useState<string | null>(null)
  const highlighted = WILAYAH.filter((w) => w.prov)
  const hlNames = new Set(highlighted.map((w) => w.prov))
  const dim = (k: string) => hover !== null && hover !== k

  return (
    <Card
      title="Sebaran wilayah nilai penilaian"
      subtitle="Berdasarkan nilai penilaian · data wilayah ilustratif, terpisah dari dataset laporan"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="relative overflow-hidden rounded-xl bg-subtle">
          <span className="absolute left-3 top-3 z-10 rounded-md bg-white px-2.5 py-1 text-[10px] text-panel-muted shadow-sm">
            <b className="mr-1 font-semibold text-ink">A–D</b> Provinsi yang dirinci
          </span>
          <svg
            viewBox={`0 0 ${mapData.width} ${mapData.height}`}
            className="h-auto w-full"
            role="img"
            aria-label="Peta Indonesia dengan provinsi DKI Jakarta, Jawa Barat, Jawa Timur dan Kalimantan Timur disorot"
          >
            <defs>
              <filter id="badge-shadow" x="-20%" y="-30%" width="140%" height="180%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#123a60" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* provinsi netral */}
            <g fill="#d9e4f0" stroke="#fff" strokeWidth="0.6" strokeLinejoin="round">
              {provinces
                .filter((p) => !hlNames.has(p.name))
                .map((p) => (
                  <path key={p.name} d={p.d} />
                ))}
            </g>

            {/* provinsi yang dirinci */}
            {highlighted.map((w) => {
              const p = byName.get(w.prov!)
              if (!p) return null
              return (
                <path
                  key={w.key}
                  d={p.d}
                  fill={w.color}
                  stroke="#fff"
                  strokeWidth={hover === w.key ? 1.6 : 0.8}
                  strokeLinejoin="round"
                  opacity={dim(w.key) ? 0.45 : 1}
                  style={{ transition: 'opacity .2s, stroke-width .2s', cursor: 'pointer' }}
                  onMouseEnter={() => setHover(w.key)}
                  onMouseLeave={() => setHover(null)}
                />
              )
            })}

            {/* garis penunjuk, penanda & badge */}
            {highlighted.map((w) => {
              const p = byName.get(w.prov!)
              const b = BADGE[w.key]
              if (!p || !b) return null
              const bx = b.x + BW / 2
              const by = b.y + BH / 2
              return (
                <g
                  key={w.key}
                  opacity={dim(w.key) ? 0.45 : 1}
                  style={{ transition: 'opacity .2s', cursor: 'pointer' }}
                  onMouseEnter={() => setHover(w.key)}
                  onMouseLeave={() => setHover(null)}
                >
                  <line x1={bx} y1={by} x2={p.cx} y2={p.cy} stroke={w.color} strokeWidth="1.2" />
                  <circle cx={p.cx} cy={p.cy} r="4.5" fill="#fff" stroke={w.color} strokeWidth="2" />
                  <g filter="url(#badge-shadow)">
                    <rect x={b.x} y={b.y} width={BW} height={BH} rx="7" fill="#fff" />
                  </g>
                  <rect x={b.x + 5} y={b.y + 4} width="18" height="18" rx="4" fill={w.color} />
                  <text x={b.x + 14} y={b.y + 17} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                    {w.key}
                  </text>
                  <text x={b.x + 30} y={b.y + 17.5} fontSize="11" fontWeight="700" fill="#172b46">
                    {fmtNum(w.nilai, 1)} M
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Tabel wilayah */}
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-thead px-3 py-2.5 text-[11px] font-semibold text-ink">
            <span>Wilayah</span>
            <span className="text-right">Nilai (Rp miliar)</span>
            <span className="w-12 text-right">Bagian</span>
          </div>
          <ul>
            {WILAYAH.map((w, i) => (
              <li
                key={w.key}
                onMouseEnter={() => setHover(w.key)}
                onMouseLeave={() => setHover(null)}
                className={`px-3 py-2.5 transition-colors ${hover === w.key ? 'bg-subtle' : i % 2 ? 'bg-row' : 'bg-white'}`}
              >
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-xs">
                  <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
                    <span
                      className="grid size-5 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white"
                      style={{ background: w.color }}
                    >
                      {w.key}
                    </span>
                    <span className="truncate">{w.name}</span>
                  </span>
                  <span className="text-right font-bold text-ink">{fmtNum(w.nilai, 1)}</span>
                  <span className="w-12 text-right font-bold" style={{ color: w.color }}>
                    {fmtNum(w.pct, 1)}%
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] rounded-full bg-c-grid">
                  <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${w.pct * 2.4}%`, background: w.color }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
