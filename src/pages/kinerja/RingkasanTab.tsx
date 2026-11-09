import { useState } from 'react'
import type { KinerjaData } from '../../data/kinerjaData'
import { fmtNum } from '../../lib/format'
import { Card } from './Card'
import { DonutCard } from './DonutCard'
import { RegionMap } from './RegionMap'
import { TrenCard } from './TrenCard'

function Distribusi({ data }: { data: KinerjaData }) {
  const [hover, setHover] = useState<number | null>(null)
  return (
    <Card title="Distribusi nilai hasil penilaian" subtitle="Persentase dari seluruh baris nilai wajar">
      <ul className="space-y-3.5">
        {data.distribusi.map((d, i) => (
          <li
            key={d.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`cursor-default transition-opacity ${hover !== null && hover !== i ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-between text-[11px] text-ink">
              <span className="font-medium">{d.label}</span>
              <span className="font-semibold">{fmtNum(d.pct)}%</span>
            </div>
            <div className="mt-1.5 h-[5px] rounded-full bg-c-grid">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${d.pct}%`, background: d.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function GrafikObjek({ data }: { data: KinerjaData }) {
  const [hover, setHover] = useState<number | null>(null)
  const total = data.objek.reduce((a, b) => a + b.count, 0)
  const max = Math.max(...data.objek.map((o) => o.count), 1) * 1.09
  return (
    <Card title="Grafik objek penilaian" subtitle={`${total} objek menurut kategori`}>
      <ul className="space-y-4">
        {data.objek.map((o, i) => (
          <li
            key={o.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`cursor-default transition-opacity ${hover !== null && hover !== i ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-between text-[11px] text-ink">
              <span className="font-semibold">{o.label}</span>
              <span className="font-medium">{o.count} objek</span>
            </div>
            <div className="mt-1.5 h-[6px] rounded-full bg-c-grid">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${(o.count / max) * 100}%`, background: o.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function RingkasanTab({ data }: { data: KinerjaData }) {
  const total = data.kpi.totalNilai
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TrenCard data={data} />
        <Distribusi data={data} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DonutCard
          title="Komposisi nilai penilaian"
          subtitle="Berdasarkan tujuan"
          ariaLabel="Donut komposisi nilai penilaian berdasarkan tujuan"
          centerValue={fmtNum(total, 2)}
          centerUnit="Rp miliar"
          items={data.tujuan.map((s) => ({
            label: s.label,
            color: s.color,
            value: s.pct,
            detail: `${fmtNum(s.pct, 1)}% · ${fmtNum(s.nilai, 2)} · ${s.laporan} laporan`,
          }))}
        />
        <DonutCard
          title="Komposisi jenis penilaian"
          subtitle="Berdasarkan objek"
          ariaLabel="Donut komposisi jenis penilaian berdasarkan objek"
          centerValue={fmtNum(total, 2)}
          centerUnit="Rp miliar"
          items={data.jenisObjek.map((s) => ({
            label: s.label,
            color: s.color,
            value: s.pct,
            detail: `${fmtNum(s.pct, 1)}% · ${fmtNum(s.nilai, 2)} · ${s.laporan} laporan`,
          }))}
        />
      </div>

      <RegionMap />

      <div className="grid gap-4 lg:grid-cols-2">
        <GrafikObjek data={data} />
        <DonutCard
          title="Laporan sesuai kewenangan jenjang"
          subtitle={`${data.kpi.laporan} laporan menurut jenjang`}
          ariaLabel="Donut laporan sesuai kewenangan jenjang"
          centerValue={String(data.kpi.laporan)}
          centerUnit="laporan"
          items={data.jenjang.map((j) => ({
            label: j.label,
            color: j.color,
            value: j.laporan,
            detail: `${j.laporan} laporan · ${fmtNum(j.pct, 1)}%`,
          }))}
        />
      </div>
    </div>
  )
}
