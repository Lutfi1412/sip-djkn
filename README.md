# SIP DJKN — Monitoring Kanwil (prototipe)

React + Vite + TypeScript + Bun + Tailwind CSS v4. Semua data dummy.

## Menjalankan
```bash
bun install
bun dev          # http://localhost:5173
bun run build    # build produksi (cek tipe + bundle)
```

## Akses login (demo)
| Langkah | Isian |
|---|---|
| 1. Login | Username: `yanuar` · Password: `sip2026` |
| 2. Pilih akses | Role: **Monitoring Kanwil** (NIP & Nama terisi otomatis) |

Role "Dummy 2" dan "Dummy 3" hanya menampilkan pesan belum tersedia.
Kredensial ada di `src/data/user.ts` (`DEMO_LOGIN`).

## Struktur singkat
- `src/pages/` — Login, Monitoring Data, Kinerja (+ `kinerja/` untuk tab & modal filter)
- `src/components/` — layout (sidebar, topbar), ui (field, modal, tabel), charts
- `src/data/` — data dummy; `indonesiaMap.json` dihasilkan `scripts/build-map.mjs`
- `src/index.css` — token warna dari palet desain
- Loading 1,5 detik: `src/hooks/useSimulatedLoading.ts`

## Tips uji cepat
- Kondisi data kosong: Monitoring Data → Nama Kantor "Kanwil DJKN Sumatera Utara" → Terapkan filter.
- Filter Kinerja: tombol Filter → ubah tahun/unit/jenjang/PFPP → Terapkan (angka dummy ikut berubah).
