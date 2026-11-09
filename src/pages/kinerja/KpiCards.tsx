import { ArrowRight, Clock, Database, FileText } from 'lucide-react'
import type { KinerjaData } from '../../data/kinerjaData'
import { fmtNum, rupiahMiliar, rupiahPenuh } from '../../lib/format'

interface Props {
  data: KinerjaData
  onPermohonan: () => void
  onLaporan: () => void
}

export function KpiCards({ data, onPermohonan, onLaporan }: Props) {
  const { kpi } = data
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Jumlah Permohonan — kartu unggulan (gradien SIP) */}
      <article className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-navy to-brand p-5 text-white shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold">Jumlah Permohonan</h3>
            <p className="mt-2 text-[32px] font-bold leading-none">{fmtNum(kpi.permohonan)}</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-white text-primary">
            <FileText className="size-5" aria-hidden />
          </span>
        </div>
        <button type="button" onClick={onPermohonan} className="mt-4 flex items-center gap-1.5 text-left text-sm font-medium hover:underline">
          Lihat permohonan <ArrowRight className="size-4" aria-hidden />
        </button>
      </article>

      <article className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-title">Jumlah Laporan</h3>
            <p className="mt-2 text-[32px] font-bold leading-none text-title">{fmtNum(kpi.laporan)}</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-title text-white">
            <FileText className="size-5" aria-hidden />
          </span>
        </div>
        <button type="button" onClick={onLaporan} className="mt-4 flex items-center gap-1.5 text-left text-sm font-medium text-link hover:underline">
          Lihat Laporan <ArrowRight className="size-4" aria-hidden />
        </button>
      </article>

      <article className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-bold leading-snug text-title">
            Rata-rata
            <br />
            penyelesaian
          </h3>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-title text-white">
            <Clock className="size-5" aria-hidden />
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[32px] font-bold leading-none text-title">{fmtNum(kpi.rataHari, 1)}</p>
          <p className="mt-1.5 text-sm text-panel-muted">Hari/laporan</p>
        </div>
      </article>

      <article className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-title">Total nilai penilaian</h3>
            <p className="mt-2 text-[26px] font-bold leading-none text-title">{rupiahMiliar(kpi.totalNilai)}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-title text-white">
            <Database className="size-5" aria-hidden />
          </span>
        </div>
        <p className="mt-4 text-sm text-panel-muted">{rupiahPenuh(kpi.totalNilai * 1e9)}</p>
      </article>
    </div>
  )
}
