export const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const fmt = (digits: number) =>
  new Intl.NumberFormat('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** 1234.5 → "1.234,5" */
export const fmtNum = (n: number, digits = 0) => fmt(digits).format(n)

/** Rp1.250.000.000 (gaya tabel) */
export const rupiah = (n: number) => `Rp${fmtNum(Math.round(n))}`

/** Rp. 620.810.000.000 (gaya KPI) */
export const rupiahPenuh = (n: number) => `Rp. ${fmtNum(Math.round(n))}`

/** nilai dalam miliar → Rp. 620,81 M */
export const rupiahMiliar = (m: number) => `Rp. ${fmtNum(m, 2)} M`

/** "2026-01-05" → "05 Jan 2026" */
export function fmtTanggal(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d} ${BULAN[Number(m) - 1]} ${y}`
}

/** Bagi total ke beberapa bobot dengan metode largest remainder, jumlahnya selalu = total */
export function apportion(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map((w) => (w / sum) * total)
  const out = raw.map(Math.floor)
  let rest = total - out.reduce((a, b) => a + b, 0)
  raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
    .forEach(({ i }) => {
      if (rest > 0) {
        out[i] += 1
        rest -= 1
      }
    })
  return out
}
