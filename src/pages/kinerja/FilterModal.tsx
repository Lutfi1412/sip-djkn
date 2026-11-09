import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { DateField, FieldLabel, SelectField } from '../../components/ui/Fields'
import { btnPrimary, btnSecondary } from '../../components/ui/buttons'
import {
  ALL,
  defaultFilter,
  ESELON_OPTIONS,
  JENJANG_OPTIONS,
  PFPP_OPTIONS,
  TAHUN_OPTIONS,
  UNIT_KERJA_OPTIONS,
  yearRange,
  type KinerjaFilter,
} from '../../data/kinerjaData'

const opts = (list: string[], all: string) => [{ value: ALL, label: all }, ...list.map((v) => ({ value: v, label: v }))]

interface Props {
  open: boolean
  onClose: () => void
  value: KinerjaFilter
  onApply: (f: KinerjaFilter) => void
}

function FilterForm({ value, onApply, onClose }: Omit<Props, 'open'>) {
  const [f, setF] = useState(value)
  const set = <K extends keyof KinerjaFilter>(k: K, v: KinerjaFilter[K]) => setF((x) => ({ ...x, [k]: v }))
  const invalid = !!f.mulai && !!f.akhir && f.akhir < f.mulai

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (invalid) return
        onApply(f)
        onClose()
      }}
    >
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <SelectField
          label="Tahun"
          value={f.tahun}
          // ganti tahun → periode ikut menyesuaikan ke satu tahun penuh
          onChange={(v) => setF((x) => ({ ...x, tahun: v, ...yearRange(v) }))}
          options={TAHUN_OPTIONS.map((t) => ({ value: t, label: t }))}
        />

        <div>
          <FieldLabel>Periode tanggal laporan</FieldLabel>
          <div className="flex items-center gap-2">
            <DateField value={f.mulai} onChange={(v) => set('mulai', v)} placeholder="Mulai" compact max={f.akhir || undefined} invalid={invalid} className="min-w-0 flex-1" />
            <span className="shrink-0 text-xs text-panel-muted">s.d.</span>
            <DateField value={f.akhir} onChange={(v) => set('akhir', v)} placeholder="Akhir" compact min={f.mulai || undefined} invalid={invalid} className="min-w-0 flex-1" />
          </div>
        </div>

        <SelectField label="Unit Eselon II" value={f.eselon} onChange={(v) => set('eselon', v)} options={opts(ESELON_OPTIONS, 'Semua unit')} />
        <SelectField label="Unit kerja" value={f.unitKerja} onChange={(v) => set('unitKerja', v)} options={opts(UNIT_KERJA_OPTIONS, 'Semua KPKNL')} />
        <SelectField label="Jenjang PFPP" value={f.jenjang} onChange={(v) => set('jenjang', v)} options={opts(JENJANG_OPTIONS, 'Semua jenjang')} />
        <SelectField label="Nama PFPP" value={f.pfpp} onChange={(v) => set('pfpp', v)} options={opts(PFPP_OPTIONS, 'Semua penilai')} />
      </div>

      {invalid && (
        <p role="alert" className="mt-4 rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">
          Tanggal akhir tidak boleh lebih awal dari tanggal mulai.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={invalid} className={`${btnPrimary} h-11 px-7`}>
          Terapkan
        </button>
        <button type="button" onClick={() => setF(defaultFilter)} className={`${btnSecondary} h-11 border-line-strong px-6 text-ink hover:bg-soft`}>
          Reset Filter
        </button>
      </div>
    </form>
  )
}

export function FilterModal({ open, onClose, value, onApply }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Filter kinerja penilaian" subtitle="Atur cakupan data yang ingin ditampilkan pada dashboard.">
      <FilterForm value={value} onApply={onApply} onClose={onClose} />
    </Modal>
  )
}
