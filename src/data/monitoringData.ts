export interface LaporanRow {
  id: number
  pemohon: string
  noSurat: string
  tglSurat: string // ISO yyyy-mm-dd
  noLaporan: string
  tglPenilaian: string // ISO
  nilai: number
  kantor: string
  objek: string
}

export const KANTOR_OPTIONS = [
  'Kanwil DJKN DKI Jakarta',
  'Kanwil DJKN Jawa Barat',
  'Kanwil DJKN Jawa Timur',
  'Kanwil DJKN Kalimantan Timur',
  'Kanwil DJKN Sumatera Utara', // sengaja tanpa data → memunculkan kondisi data kosong
]

export const OBJEK_OPTIONS = ['Tanah', 'Bangunan', 'Tanah dan Bangunan', 'Peralatan dan Mesin', 'Aset Tak Berwujud']

export const DASAR_TANGGAL_OPTIONS = [
  { value: 'surat', label: 'Tanggal Surat' },
  { value: 'penilaian', label: 'Tanggal Penilaian' },
]

const SURAT_KODE = ['SINKES', 'UN', 'ATR', 'DISDIK', 'PN', 'KEMENAG', 'PUPR', 'BPN', 'POLRI', 'KEJATI']
const iso = (m: number, d: number) => `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

// 6 baris pertama persis seperti desain
const DESAIN: Omit<LaporanRow, 'id' | 'kantor' | 'objek'>[] = [
  { pemohon: 'Pemohon contoh 1', noSurat: 'S-021/SINKES/2026', tglSurat: iso(1, 5), noLaporan: 'LAP-001/KNL.0301/2026', tglPenilaian: iso(1, 12), nilai: 1_250_000_000 },
  { pemohon: 'Pemohon contoh 2', noSurat: 'S-045/UN/2026', tglSurat: iso(1, 8), noLaporan: 'LAP-002/KNL.0301/2026', tglPenilaian: iso(1, 12), nilai: 875_500_000 },
  { pemohon: 'Pemohon contoh 3', noSurat: 'S-012/ATR/2026a', tglSurat: iso(1, 10), noLaporan: 'LAP-004/KNL.0301/2026', tglPenilaian: iso(1, 12), nilai: 3_420_000_000 },
  { pemohon: 'Pemohon contoh 4', noSurat: 'S-067/DISDIK/2026', tglSurat: iso(1, 15), noLaporan: 'LAP-005/KNL.0301/2026', tglPenilaian: iso(1, 17), nilai: 650_750_000 },
  { pemohon: 'Pemohon contoh 5', noSurat: 'S-033/PN/2026', tglSurat: iso(1, 20), noLaporan: 'LAP-006/KNL.0301/2026', tglPenilaian: iso(1, 23), nilai: 2_180_000_000 },
  { pemohon: 'Pemohon contoh 6', noSurat: 'S-089/KEMENAG/2026', tglSurat: iso(1, 25), noLaporan: 'LAP-007/KNL.0301/2026', tglPenilaian: iso(1, 27), nilai: 2_180_000_000 },
]

export const LAPORAN: LaporanRow[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1
  const kantor = KANTOR_OPTIONS[i % 4]
  const objek = OBJEK_OPTIONS[i % 4]
  if (i < DESAIN.length) return { id: n, kantor, objek, ...DESAIN[i] }

  // baris 7–30: dihasilkan deterministik, tersebar Jan–Des
  const bulan = 1 + Math.floor((i - 6) / 2) % 12
  const hari = 3 + ((i * 7) % 22)
  const selisih = 2 + (i % 6)
  return {
    id: n,
    pemohon: `Pemohon contoh ${n}`,
    noSurat: `S-${String(10 + ((i * 13) % 90)).padStart(3, '0')}/${SURAT_KODE[i % SURAT_KODE.length]}/2026`,
    tglSurat: iso(bulan, hari),
    noLaporan: `LAP-${String(n + 1).padStart(3, '0')}/KNL.0301/2026`,
    tglPenilaian: iso(bulan, Math.min(28, hari + selisih)),
    nilai: (250 + ((i * 377) % 4200)) * 1_000_000 + (i % 5) * 50_000_000,
    kantor,
    objek,
  }
})
