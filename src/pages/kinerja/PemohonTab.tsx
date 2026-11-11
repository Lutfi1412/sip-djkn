import type { KinerjaData } from '../../data/kinerjaData'
import { fmtNum } from '../../lib/format'
import { Card } from './Card'
import { DonutCard } from './DonutCard'

export function PemohonTab({ data }: { data: KinerjaData }) {
  const { pemohon } = data
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <DonutCard
        title="Komposisi pemohon"
        className="rounded-tl-none"
        subtitle={`Sumber agregat · ${fmtNum(pemohon.totalLaporan)} laporan · Hanya filter unit`}
        ariaLabel="Donut komposisi pemohon"
        centerValue={fmtNum(pemohon.totalLaporan)}
        centerUnit="laporan"
        items={pemohon.komposisi.map((k) => ({
          label: k.label,
          color: k.color,
          value: k.laporan,
          detail: `${fmtNum(k.pct, 1)}%`,
        }))}
      />

      <Card title="Jenis barang per pemohon (top)" subtitle="Cakupan sumber agregat: hanya filter unit yang berlaku">
        <div className="thin-scroll overflow-x-auto rounded-lg">
          <table className="w-full min-w-[440px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="bg-thead text-ink">
                <th scope="col" className="px-3 py-2.5 font-semibold">Pemohon</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Jenis barang</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold">Nilai (Rp M)</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {pemohon.jenisBarang.map((r) => (
                <tr key={r.pemohon} className="border-b border-line text-panel-muted transition-colors last:border-b-0 hover:bg-soft">
                  <td className="px-3 py-3.5 font-medium text-ink">{r.pemohon}</td>
                  <td className="px-3 py-3.5">{r.jenis}</td>
                  <td className="px-3 py-3.5 text-right">{fmtNum(r.nilai, 1)}</td>
                  <td className="px-3 py-3.5 text-right">{fmtNum(r.pct, 1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[10px] text-panel-muted">M = miliar · persentase jenis teratas di setiap kelompok pemohon.</p>
      </Card>
    </div>
  )
}
