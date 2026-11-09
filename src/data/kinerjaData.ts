import { apportion, BULAN } from '../lib/format'

/* ============================================================
   Filter
   ============================================================ */
export interface KinerjaFilter {
  tahun: string
  mulai: string
  akhir: string
  eselon: string
  unitKerja: string
  jenjang: string
  pfpp: string
}

export const ALL = 'all'

/** Periode default = satu tahun penuh (sesuai desain: 01 Jan – 31 Des) */
export const yearRange = (tahun: string) => ({ mulai: `${tahun}-01-01`, akhir: `${tahun}-12-31` })

export const defaultFilter: KinerjaFilter = {
  tahun: '2026',
  ...yearRange('2026'),
  eselon: ALL,
  unitKerja: ALL,
  jenjang: ALL,
  pfpp: ALL,
}

export const TAHUN_OPTIONS = ['2026', '2025', '2024']
export const ESELON_OPTIONS = [
  'Sekretariat DJKN',
  'Direktorat Penilaian Kekayaan Negara',
  'Kanwil DJKN DKI Jakarta',
  'Kanwil DJKN Jawa Barat',
]
export const UNIT_KERJA_OPTIONS = ['KPKNL Jakarta I', 'KPKNL Jakarta II', 'KPKNL Bandung', 'KPKNL Surabaya', 'KPKNL Balikpapan']
export const JENJANG_OPTIONS = [
  'Penilai Pemerintah Ahli Pertama',
  'Penilai Pemerintah Ahli Muda',
  'Penilai Pemerintah Ahli Madya',
  'Penilai Pemerintah Ahli Utama',
]
export const PFPP_OPTIONS = [
  'Andri Setia Budi',
  'Fahdrian Kemala',
  'Gumilang Wicaksono',
  'Hendra Jan Sadarmo Purba',
  'Sairin',
]

export const isDefaultFilter = (f: KinerjaFilter) =>
  (Object.keys(defaultFilter) as (keyof KinerjaFilter)[]).every((k) => f[k] === defaultFilter[k])

/** Dummy: semakin spesifik filter, semakin kecil cakupan datanya (deterministik). */
function factor(f: KinerjaFilter) {
  let x = 1
  if (f.tahun === '2025') x *= 0.8
  if (f.tahun === '2024') x *= 0.6
  const full = yearRange(f.tahun)
  if (f.mulai !== full.mulai || f.akhir !== full.akhir) x *= 0.75
  if (f.eselon !== ALL) x *= 0.7
  if (f.unitKerja !== ALL) x *= 0.6
  if (f.jenjang !== ALL) x *= 0.65
  if (f.pfpp !== ALL) x *= 0.5
  return Math.max(0.15, x)
}

/* ============================================================
   Basis data (sesuai desain: 14 laporan · Rp 620,81 M)
   ============================================================ */
const C = {
  blue: '#215db8',
  teal: '#07837b',
  purple: '#7755ca',
  amber: '#b77718',
  slate: '#788aa5',
}

const TREN_NILAI = [13, 22, 20, 38, 24, 60, 40, 86, 102, 63, 76, 76.81] // Σ = 620,81
const TREN_LAPORAN = [1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1] // Σ = 14

const round1 = (n: number) => Math.round(n * 10) / 10
const round2 = (n: number) => Math.round(n * 100) / 100

export interface Slice {
  label: string
  color: string
  pct: number
  nilai: number
  laporan: number
}

export interface KinerjaData {
  tahun: string
  kpi: { permohonan: number; laporan: number; rataHari: number; totalNilai: number }
  tren: { bulan: string; nilai: number; laporan: number }[]
  distribusi: { label: string; pct: number; color: string }[]
  tujuan: Slice[]
  jenisObjek: Slice[]
  objek: { label: string; count: number; color: string }[]
  jenjang: { label: string; laporan: number; pct: number; color: string }[]
  pemohon: {
    totalLaporan: number
    komposisi: { label: string; pct: number; color: string; laporan: number }[]
    jenisBarang: { pemohon: string; jenis: string; nilai: number; pct: number }[]
  }
}

export function buildKinerja(f: KinerjaFilter): KinerjaData {
  const k = factor(f)
  const laporan = Math.max(1, Math.round(14 * k))
  const permohonan = Math.max(laporan, Math.round(20 * k))
  const totalNilai = round2(620.81 * k)

  const bulanLap = apportion(TREN_LAPORAN, laporan)

  const slices = (base: { label: string; color: string; pct: number; nilai: number; lap: number }[]): Slice[] => {
    const lap = apportion(base.map((b) => b.lap), laporan)
    return base.map((b, i) => ({
      label: b.label,
      color: b.color,
      pct: b.pct,
      nilai: round2(b.nilai * k),
      laporan: lap[i],
    }))
  }

  const jenjangLap = apportion([5, 4, 3, 1, 1], laporan)
  const jenjangBase = [
    { label: 'Ahli Pertama', color: C.blue },
    { label: 'Ahli Muda', color: C.teal },
    { label: 'Ahli Madya', color: C.purple },
    { label: 'Ahli Utama', color: C.amber },
    { label: 'Belum terdefinisi', color: C.slate },
  ]

  const objekTotal = Math.max(1, Math.round(25 * k))
  const objekCount = apportion([11, 7, 5, 2], objekTotal)

  const pemTotal = Math.max(1, Math.round(374 * k))
  const pemLap = apportion([535, 307, 126, 32], pemTotal)

  return {
    tahun: f.tahun,
    kpi: { permohonan, laporan, rataHari: round1(34.4 + (1 - k) * 6.5), totalNilai },
    tren: BULAN.map((bulan, i) => ({ bulan, nilai: round2(TREN_NILAI[i] * k), laporan: bulanLap[i] })),
    distribusi: [
      { label: 'Di atas Rp1 triliun', pct: 0, color: C.blue },
      { label: 'Rp100 miliar – Rp1 triliun', pct: 10, color: C.blue },
      { label: 'Rp1 miliar – Rp100 miliar', pct: 45, color: C.teal },
      { label: 'Rp500 juta – Rp1 miliar', pct: 20, color: C.purple },
      { label: 'Di bawah Rp500 juta', pct: 25, color: C.amber },
    ],
    tujuan: slices([
      { label: 'Pemanfaatan – Sewa', color: C.blue, pct: 66, nilai: 410, lap: 8 },
      { label: 'Penyusunan Neraca Pemerintah Pusat', color: C.teal, pct: 24.5, nilai: 152, lap: 4 },
      { label: 'Pemindahtanganan – Penjualan', color: C.purple, pct: 9.5, nilai: 58.81, lap: 2 },
    ]),
    jenisObjek: slices([
      { label: 'Penilaian properti', color: C.blue, pct: 82.2, nilai: 510, lap: 9 },
      { label: 'Penilaian mesin dan peralatan', color: C.teal, pct: 14.5, nilai: 90, lap: 3 },
      { label: 'Penilaian jenis lainnya', color: C.purple, pct: 3.4, nilai: 20.81, lap: 2 },
    ]),
    objek: [
      { label: 'Tanah', count: objekCount[0], color: C.blue },
      { label: 'Bangunan', count: objekCount[1], color: C.teal },
      { label: 'Peralatan dan mesin', count: objekCount[2], color: C.purple },
      { label: 'Tidak diketahui', count: objekCount[3], color: C.amber },
    ],
    jenjang: jenjangBase.map((j, i) => ({
      ...j,
      laporan: jenjangLap[i],
      pct: round1((jenjangLap[i] / laporan) * 100),
    })),
    pemohon: {
      totalLaporan: pemTotal,
      komposisi: [
        { label: 'Kementerian / lembaga', pct: 53.5, color: C.blue, laporan: pemLap[0] },
        { label: 'Kejaksaan', pct: 30.7, color: C.teal, laporan: pemLap[1] },
        { label: 'DJKN', pct: 12.6, color: C.purple, laporan: pemLap[2] },
        { label: 'Lainnya', pct: 3.2, color: C.amber, laporan: pemLap[3] },
      ],
      jenisBarang: [
        { pemohon: 'Kejaksaan', jenis: 'Tanah', nilai: round1(165.8 * k), pct: 97.8 },
        { pemohon: 'Kementerian / lembaga', jenis: 'Tanah', nilai: round1(49.5 * k), pct: 77.1 },
        { pemohon: 'DJKN', jenis: 'Tanah', nilai: round1(13.5 * k), pct: 86.8 },
        { pemohon: 'Lainnya', jenis: 'Peralatan / mesin', nilai: 0, pct: 100 },
      ],
    },
  }
}

/* ============================================================
   Sebaran wilayah (ilustratif — sesuai desain, tidak ikut filter)
   ============================================================ */
export interface Wilayah {
  key: string
  name: string
  nilai: number
  pct: number
  color: string
  /** nama provinsi pada GeoJSON; null = wilayah lainnya */
  prov: string | null
}

export const WILAYAH: Wilayah[] = [
  { key: 'A', name: 'DKI Jakarta', nilai: 8450, pct: 32.1, color: '#174a9b', prov: 'DKI JAKARTA' },
  { key: 'B', name: 'Jawa Barat', nilai: 4220, pct: 16.0, color: '#268660', prov: 'JAWA BARAT' },
  { key: 'C', name: 'Jawa Timur', nilai: 3760, pct: 14.3, color: '#b67012', prov: 'JAWA TIMUR' },
  { key: 'D', name: 'Kalimantan Timur', nilai: 2180, pct: 8.3, color: '#6b50b8', prov: 'KALIMANTAN TIMUR' },
  { key: '–', name: 'Wilayah lainnya', nilai: 7750, pct: 29.3, color: '#788aa5', prov: null },
]

/* ============================================================
   Tab "Beban Kerja & Waktu"
   ============================================================ */
const NAMA_EXTRA = [
  'Budi Santoso', 'Citra Lestari', 'Dian Pramudito', 'Eka Wulandari', 'Farid Hidayat', 'Galih Prakoso',
  'Hana Puspita', 'Irfan Maulana', 'Joko Susilo', 'Kartika Sari', 'Lukman Hakim', 'Maya Anggraini',
  'Nanda Pratama', 'Oki Setiawan', 'Putri Ayu', 'Rendra Wijaya', 'Siska Amelia', 'Taufik Rahman',
  'Umar Faruq', 'Vina Oktaviani', 'Wahyu Nugroho', 'Yusuf Ramadhan', 'Zahra Nabila', 'Arif Budiman', 'Bayu Kusuma',
]
const JENJANG_LONG = ['Ahli Pertama', 'Ahli Muda', 'Ahli Madya', 'Ahli Utama'].map((j) => `Penilai Pemerintah ${j}`)
const TUJUAN_ROW = ['Pemanfaatan – Sewa', 'Pemindahtanganan – Penjualan', 'Penyusunan Neraca Pemerintah Pusat']

export interface BebanRow {
  nama: string
  jenjang: string
  laporan: number
  permohonan: number
  nilai: number
  hari: number
  objek: number
}

const BEBAN_DESAIN: BebanRow[] = [
  { nama: 'Andri Setia Budi', jenjang: 'Penilai Pemerintah Ahli Pertama', laporan: 1, permohonan: 1, nilai: 1_000_000_000, hari: 24, objek: 1 },
  { nama: 'Fahdrian Kemala', jenjang: 'Penilai Pemerintah Ahli Muda', laporan: 2, permohonan: 1, nilai: 14_444, hari: 222, objek: 2 },
  { nama: 'Gumilang Wicaksono', jenjang: 'Penilai Pemerintah Ahli Pertama', laporan: 3, permohonan: 2, nilai: 625_000_006, hari: 1, objek: 3 },
  { nama: 'Hendra Jan Sadarmo Purba', jenjang: 'Penilai Pemerintah Ahli Muda', laporan: 2, permohonan: 2, nilai: 1_012_223, hari: 21, objek: 2 },
  { nama: 'Sairin', jenjang: 'Penilai Pemerintah Ahli Pertama', laporan: 2, permohonan: 2, nilai: 1_012_223, hari: 21, objek: 2 },
]

export const MATRIKS_BEBAN: BebanRow[] = Array.from({ length: 30 }, (_, i) => {
  if (i < BEBAN_DESAIN.length) return BEBAN_DESAIN[i]
  const lap = 1 + (i % 4)
  return {
    nama: NAMA_EXTRA[(i - 5) % NAMA_EXTRA.length],
    jenjang: JENJANG_LONG[i % 4],
    laporan: lap,
    permohonan: Math.max(1, lap - (i % 2)),
    nilai: (120 + ((i * 531) % 3800)) * 1_000_000,
    hari: 3 + ((i * 17) % 120),
    objek: lap + (i % 2),
  }
})

export interface NormaRow {
  nama: string
  tujuan: string
  hari: number
}

const NORMA_DESAIN: NormaRow[] = [
  { nama: 'Andri Setia Budi', tujuan: 'Pemanfaatan – Sewa', hari: 24 },
  { nama: 'Fahdrian Kemala', tujuan: 'Pemanfaatan – Sewa', hari: 222 },
  { nama: 'Gumilang Wicaksono', tujuan: 'Pemanfaatan – Sewa', hari: 0 },
  { nama: 'Gumilang Wicaksono', tujuan: 'Pemindahtanganan – Penjualan', hari: 1 },
  { nama: 'Hendra Jan Sadarmo Purba', tujuan: 'Pemanfaatan – Sewa', hari: 21 },
]

export const NORMA_WAKTU: NormaRow[] = Array.from({ length: 30 }, (_, i) =>
  i < NORMA_DESAIN.length
    ? NORMA_DESAIN[i]
    : { nama: NAMA_EXTRA[(i + 3) % NAMA_EXTRA.length], tujuan: TUJUAN_ROW[i % 3], hari: 2 + ((i * 23) % 90) },
)

export interface BantuanRow {
  nama: string
  jenjang: string
  permohonan: number
  laporan: number
  nilai: number
  hari: number
  objek: number
  eselon: string
  unitKerja: string
  peminta: string
}

const PEMINTA = ['Kantor Pelayanan…', 'KPKNL Jakarta I', 'KPKNL Bandung', 'KPKNL Surabaya', 'KPKNL Balikpapan']

export const BANTUAN_TENAGA: BantuanRow[] = Array.from({ length: 30 }, (_, i) => {
  if (i === 0)
    return { nama: 'Sairin', jenjang: 'Penilai Pemerintah Ahli Pertama', permohonan: 2, laporan: 2, nilai: 1_012_223, hari: 21, objek: 2, eselon: '17', unitKerja: '1712', peminta: 'Kantor Pelayanan…' }
  if (i === 1)
    return { nama: 'Sutanto Basuki', jenjang: 'Kepala Seksi Penilaian II', permohonan: 2, laporan: 2, nilai: 1_012_223, hari: 21, objek: 2, eselon: '17', unitKerja: '1712', peminta: 'Kantor Pelayanan…' }
  const lap = 1 + (i % 3)
  return {
    nama: NAMA_EXTRA[(i + 9) % NAMA_EXTRA.length],
    jenjang: i % 3 === 0 ? 'Kepala Seksi Penilaian I' : JENJANG_LONG[i % 4],
    permohonan: lap + (i % 2),
    laporan: lap,
    nilai: (80 + ((i * 419) % 2900)) * 1_000_000,
    hari: 4 + ((i * 11) % 60),
    objek: lap,
    eselon: String(15 + (i % 4)),
    unitKerja: String(1700 + 12 + (i % 9)),
    peminta: PEMINTA[i % PEMINTA.length],
  }
})
