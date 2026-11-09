import {
  ALL,
  BANTUAN_TENAGA,
  MATRIKS_BEBAN,
  NORMA_WAKTU,
  type BantuanRow,
  type BebanRow,
  type KinerjaFilter,
  type NormaRow,
} from '../../data/kinerjaData'
import { fmtNum, rupiah } from '../../lib/format'
import { PagedTable, type Column } from './PagedTable'

const hari = (n: number, digits = 0) => `${fmtNum(n, digits)} hari`

const matriksCols: Column<BebanRow>[] = [
  { head: 'Nama PFPP', cell: (r) => r.nama, strong: true },
  { head: 'Jenjang jabatan', cell: (r) => r.jenjang },
  { head: 'Jumlah laporan', cell: (r) => r.laporan, align: 'center' },
  { head: 'Jumlah permohonan', cell: (r) => r.permohonan, align: 'center' },
  { head: 'Jumlah nilai wajar', cell: (r) => `Rp ${fmtNum(r.nilai)}` },
  { head: 'Waktu penilaian', cell: (r) => hari(r.hari, 1), align: 'right' },
  { head: 'Jumlah objek penilaian', cell: (r) => r.objek },
]

const normaCols: Column<NormaRow>[] = [
  { head: 'Nama penilai', cell: (r) => r.nama, strong: true },
  { head: 'Tujuan penilaian', cell: (r) => r.tujuan },
  { head: 'Hari penyelesaian', cell: (r) => hari(r.hari) },
]

const bantuanCols: Column<BantuanRow>[] = [
  { head: 'Nama penilai', cell: (r) => r.nama, strong: true },
  { head: 'Jenjang', cell: (r) => r.jenjang },
  { head: 'Jml. permohonan', cell: (r) => r.permohonan, align: 'center' },
  { head: 'Jml. laporan', cell: (r) => r.laporan, align: 'center' },
  { head: 'Nilai wajar', cell: (r) => rupiah(r.nilai).replace('Rp', 'Rp ') },
  { head: 'Waktu (hari)', cell: (r) => fmtNum(r.hari, 1), align: 'center' },
  { head: 'Jml. objek', cell: (r) => r.objek, align: 'center' },
  { head: 'Kode Unit Eselon II', cell: (r) => r.eselon, align: 'center' },
  { head: 'Kode unit kerja', cell: (r) => r.unitKerja, align: 'center' },
  { head: 'Unit meminta bantuan', cell: (r) => r.peminta },
]

/** Filter jenjang & nama PFPP ikut memengaruhi tabel (data dummy) */
export function BebanKerjaTab({ filter }: { filter: KinerjaFilter }) {
  const byNama = <T extends { nama: string }>(rows: T[]) => (filter.pfpp === ALL ? rows : rows.filter((r) => r.nama === filter.pfpp))
  const byJenjang = <T extends { jenjang: string }>(rows: T[]) =>
    filter.jenjang === ALL ? rows : rows.filter((r) => r.jenjang === filter.jenjang)

  return (
    <div className="space-y-4">
      <PagedTable title="Matriks beban kerja" rows={byJenjang(byNama(MATRIKS_BEBAN))} columns={matriksCols} minWidth={860} />
      <PagedTable title="Norma waktu penilaian" rows={byNama(NORMA_WAKTU)} columns={normaCols} minWidth={560} />
      <PagedTable title="Bantuan tenaga penilai" rows={byJenjang(byNama(BANTUAN_TENAGA))} columns={bantuanCols} minWidth={1060} />
    </div>
  )
}
