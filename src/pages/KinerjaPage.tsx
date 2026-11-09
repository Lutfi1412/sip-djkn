import { Download, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingOverlay } from '../components/ui/LoadingOverlay'
import { Tabs } from '../components/ui/Tabs'
import { btnPrimary, btnSecondary } from '../components/ui/buttons'
import {
  ALL,
  buildKinerja,
  defaultFilter,
  isDefaultFilter,
  yearRange,
  type KinerjaFilter,
} from '../data/kinerjaData'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import { toastSuccess } from '../lib/alert'
import { downloadCsv } from '../lib/csv'
import { fmtTanggal } from '../lib/format'
import { BebanKerjaTab } from './kinerja/BebanKerjaTab'
import { FilterModal } from './kinerja/FilterModal'
import { KpiCards } from './kinerja/KpiCards'
import { PemohonTab } from './kinerja/PemohonTab'
import { RingkasanTab } from './kinerja/RingkasanTab'

type TabId = 'ringkasan' | 'beban' | 'pemohon'
const TABS: { id: TabId; label: string }[] = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'beban', label: 'Beban Kerja & Waktu' },
  { id: 'pemohon', label: 'Pemohon' },
]

/** Ringkas filter aktif menjadi chip yang bisa dihapus satu per satu */
function activeChips(f: KinerjaFilter): { key: keyof KinerjaFilter | 'periode'; label: string }[] {
  const chips: { key: keyof KinerjaFilter | 'periode'; label: string }[] = []
  const full = yearRange(f.tahun)
  if (f.tahun !== defaultFilter.tahun) chips.push({ key: 'tahun', label: `Tahun ${f.tahun}` })
  if (f.mulai !== full.mulai || f.akhir !== full.akhir)
    chips.push({ key: 'periode', label: `Periode ${f.mulai ? fmtTanggal(f.mulai) : '…'} – ${f.akhir ? fmtTanggal(f.akhir) : '…'}` })
  if (f.eselon !== ALL) chips.push({ key: 'eselon', label: f.eselon })
  if (f.unitKerja !== ALL) chips.push({ key: 'unitKerja', label: f.unitKerja })
  if (f.jenjang !== ALL) chips.push({ key: 'jenjang', label: f.jenjang })
  if (f.pfpp !== ALL) chips.push({ key: 'pfpp', label: f.pfpp })
  return chips
}

export default function KinerjaPage() {
  const navigate = useNavigate()
  const { loading, done, run } = useSimulatedLoading()
  const [filter, setFilter] = useState<KinerjaFilter>(defaultFilter)
  const [tab, setTab] = useState<TabId>('ringkasan')
  const [modal, setModal] = useState(false)

  const data = useMemo(() => buildKinerja(filter), [filter])
  const chips = activeChips(filter)

  const apply = (next: KinerjaFilter) => run(() => setFilter(next))

  const removeChip = (key: keyof KinerjaFilter | 'periode') => {
    const next = { ...filter }
    if (key === 'periode') Object.assign(next, yearRange(filter.tahun))
    else if (key === 'tahun') Object.assign(next, { tahun: defaultFilter.tahun }, yearRange(defaultFilter.tahun))
    else next[key] = ALL
    apply(next)
  }

  const download = () => {
    downloadCsv(`kinerja-penilaian-${filter.tahun}.csv`, [
      ['Ringkasan Kinerja Penilaian', filter.tahun],
      ['Jumlah permohonan', data.kpi.permohonan],
      ['Jumlah laporan', data.kpi.laporan],
      ['Rata-rata penyelesaian (hari/laporan)', data.kpi.rataHari],
      ['Total nilai penilaian (Rp miliar)', data.kpi.totalNilai],
      [],
      ['Bulan', 'Nilai penilaian (Rp miliar)', 'Jumlah laporan'],
      ...data.tren.map((t) => [t.bulan, t.nilai, t.laporan]),
    ])
    toastSuccess('Data kinerja berhasil diunduh')
  }

  return (
    <>
      <LoadingOverlay show={loading} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-bold leading-tight text-title">Dashboard Kinerja Penilaian</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setModal(true)} className={`${btnPrimary} px-8`}>
            Filter
          </button>
          <button type="button" onClick={download} className={btnSecondary}>
            <Download className="size-4" aria-hidden /> Download Data
          </button>
        </div>
      </div>

      {!isDefaultFilter(filter) && (
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filter aktif">
          {chips.map((c) => (
            <span key={c.key} className="inline-flex items-center gap-1.5 rounded-full bg-soft py-1 pl-3 pr-1.5 text-xs font-medium text-link">
              {c.label}
              <button
                type="button"
                onClick={() => removeChip(c.key)}
                aria-label={`Hapus filter ${c.label}`}
                className="grid size-5 place-items-center rounded-full transition-colors hover:bg-white"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button type="button" onClick={() => apply(defaultFilter)} className="px-1 text-xs font-semibold text-link hover:underline">
            Reset semua
          </button>
        </div>
      )}

      <div className="mt-6">
        <KpiCards data={data} onPermohonan={() => setTab('pemohon')} onLaporan={() => navigate('/monitoring/data')} />
      </div>

      <div className="mt-6">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div
          key={`${tab}-${done}`}
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="animate-rise pt-4"
        >
          {tab === 'ringkasan' && <RingkasanTab data={data} />}
          {tab === 'beban' && <BebanKerjaTab filter={filter} />}
          {tab === 'pemohon' && <PemohonTab data={data} />}
        </div>
      </div>

      <FilterModal open={modal} onClose={() => setModal(false)} value={filter} onApply={apply} />
    </>
  )
}
