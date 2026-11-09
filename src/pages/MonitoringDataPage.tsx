import { Download, FileX2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { LoadingOverlay } from '../components/ui/LoadingOverlay'
import { btnPrimary, btnSecondary } from '../components/ui/buttons'
import { DateField, SelectField } from '../components/ui/Fields'
import { Pagination } from '../components/ui/Pagination'
import {
  DASAR_TANGGAL_OPTIONS,
  KANTOR_OPTIONS,
  LAPORAN,
  OBJEK_OPTIONS,
  type LaporanRow,
} from '../data/monitoringData'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import { toastSuccess, toastWarning } from '../lib/alert'
import { downloadCsv } from '../lib/csv'
import { fmtTanggal, rupiah } from '../lib/format'

interface Filter {
  kantor: string
  objek: string
  dasar: string
  mulai: string
  akhir: string
}
const EMPTY: Filter = { kantor: '', objek: '', dasar: '', mulai: '', akhir: '' }

function filterRows(rows: LaporanRow[], f: Filter) {
  return rows.filter((r) => {
    if (f.kantor && r.kantor !== f.kantor) return false
    if (f.objek && r.objek !== f.objek) return false
    const tgl = f.dasar === 'penilaian' ? r.tglPenilaian : r.tglSurat
    if (f.mulai && tgl < f.mulai) return false
    if (f.akhir && tgl > f.akhir) return false
    return true
  })
}

const toOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }))
const HEAD = ['No.', 'Pemohon', 'No. surat pemohon', 'Tanggal surat', 'No. laporan penilaian', 'Tanggal penilaian', 'Nilai wajar laporan']

export default function MonitoringDataPage() {
  const { loading, run } = useSimulatedLoading()
  const [draft, setDraft] = useState<Filter>(EMPTY)
  const [applied, setApplied] = useState<Filter>(EMPTY)
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const set = <K extends keyof Filter>(k: K, v: Filter[K]) => setDraft((d) => ({ ...d, [k]: v }))
  const rangeInvalid = !!draft.mulai && !!draft.akhir && draft.akhir < draft.mulai

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = filterRows(LAPORAN, applied)
    if (!q) return base
    return base.filter((r) =>
      [r.pemohon, r.noSurat, r.noLaporan, fmtTanggal(r.tglSurat), fmtTanggal(r.tglPenilaian), rupiah(r.nilai)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [applied, query])

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const visible = rows.slice(start, start + pageSize)

  const apply = () => {
    if (rangeInvalid) return
    const next = { ...draft, dasar: draft.dasar || (draft.mulai || draft.akhir ? 'surat' : '') }
    run(() => {
      setApplied(next)
      setPage(1)
    })
  }

  const download = () => {
    if (!rows.length) {
      toastWarning('Tidak ada data untuk diunduh')
      return
    }
    downloadCsv('monitoring-data-penilaian.csv', [
      HEAD,
      ...rows.map((r, i) => [i + 1, r.pemohon, r.noSurat, fmtTanggal(r.tglSurat), r.noLaporan, fmtTanggal(r.tglPenilaian), r.nilai]),
    ])
    toastSuccess(`${rows.length} data berhasil diunduh`)
  }

  return (
    <>
      <LoadingOverlay show={loading} />

      <h1 className="text-[28px] font-bold leading-tight text-title">Monitoring Data</h1>

      <section className="mt-5 rounded-2xl bg-page p-5 shadow-card sm:p-6">
        {/* Filter */}
        <h2 className="text-[13px] font-bold text-ink">Filter dan Penilaian</h2>
        <p className="mt-1 text-xs text-link">Pencarian berdasarkan kantor, periode dan objek penilaian</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SelectField
            label="Nama Kantor"
            value={draft.kantor}
            onChange={(v) => set('kantor', v)}
            placeholder="Masukan kantor wilayah"
            options={toOptions(KANTOR_OPTIONS)}
          />
          <SelectField
            label="Objek Penilaian"
            value={draft.objek}
            onChange={(v) => set('objek', v)}
            placeholder="Pilih Objek Penilaian"
            options={toOptions(OBJEK_OPTIONS)}
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <SelectField
            label="Dasar Tanggal"
            value={draft.dasar}
            onChange={(v) => set('dasar', v)}
            placeholder="Masukan Dasar Tanggal"
            options={DASAR_TANGGAL_OPTIONS}
          />
          <DateField
            label="Tanggal Mulai"
            value={draft.mulai}
            onChange={(v) => set('mulai', v)}
            placeholder="Masukan tanggal mulai"
            max={draft.akhir || undefined}
            invalid={rangeInvalid}
          />
          <DateField
            label="Tanggal Akhir"
            value={draft.akhir}
            onChange={(v) => set('akhir', v)}
            placeholder="Masukan tanggal akhir"
            min={draft.mulai || undefined}
            invalid={rangeInvalid}
          />
        </div>
        {rangeInvalid && (
          <p role="alert" className="mt-3 rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">
            Tanggal akhir tidak boleh lebih awal dari tanggal mulai.
          </p>
        )}

        <button type="button" onClick={apply} disabled={rangeInvalid} className={`${btnPrimary} mt-5`}>
          Terapkan filter
        </button>

        <hr className="my-6 border-t-2 border-line-strong/70" />

        {/* Hasil pencarian */}
        <h2 className="text-[13px] font-bold text-ink">Hasil Pencarian</h2>
        <p className="mt-1 text-xs text-link">Pencarian berdasarkan kantor, periode dan objek penilaian</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-link">
            <span>Tampilkan</span>
            <SelectField
              compact
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v))
                setPage(1)
              }}
              options={[5, 10, 25, 50].map((n) => ({ value: String(n), label: String(n) }))}
              className="w-[76px]"
            />
            <span>Baris</span>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <button type="button" onClick={download} className={btnSecondary}>
              <Download className="size-4" aria-hidden /> Download Data
            </button>
            <div className="relative min-w-[200px] flex-1 sm:flex-none">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Pencarian Data"
                aria-label="Pencarian data"
                className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/25"
              />
            </div>
          </div>
        </div>

        <div className="thin-scroll mt-4 overflow-x-auto rounded-xl">
          <table className="w-full min-w-[880px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-thead text-ink">
                {HEAD.map((h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={`whitespace-nowrap px-4 py-3.5 font-semibold ${i === HEAD.length - 1 ? 'text-right' : ''} ${
                      i === 0 ? 'rounded-l-xl' : ''
                    } ${i === HEAD.length - 1 ? 'rounded-r-xl' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={HEAD.length} className="p-0">
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                visible.map((r, i) => (
                  <tr key={r.id} className={`text-panel-muted transition-colors hover:bg-soft ${i % 2 === 0 ? 'bg-white' : 'bg-row'}`}>
                    <td className="px-4 py-3.5">{start + i + 1}</td>
                    <td className="px-4 py-3.5 font-medium text-ink">{r.pemohon}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">{r.noSurat}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">{fmtTanggal(r.tglSurat)}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">{r.noLaporan}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">{fmtTanggal(r.tglPenilaian)}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-medium text-ink">{rupiah(r.nilai)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-link">
            Menampilkan {visible.length} data dari {rows.length} data
          </p>
          <Pagination page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center bg-white px-4 py-10 text-center">
      <span className="grid size-9 place-items-center rounded-lg bg-navy text-white">
        <FileX2 className="size-[18px]" aria-hidden />
      </span>
      <p className="mt-3 text-[13px] font-bold text-title">Belum ada data penilaian</p>
      <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-link">
        Tidak ada hasil untuk filter ini. Coba ubah periode atau objek penilaian
      </p>
    </div>
  )
}
