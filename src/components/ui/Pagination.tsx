const pill =
  'h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45'

/** Nomor halaman dengan elipsis: 1 … 4 5 6 … 12 */
function pages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | '…')[] = [1]
  const from = Math.max(2, current - 1)
  const to = Math.min(total - 1, current + 1)
  if (from > 2) out.push('…')
  for (let p = from; p <= to; p++) out.push(p)
  if (to < total - 1) out.push('…')
  out.push(total)
  return out
}

interface Props {
  page: number
  pageCount: number
  onChange: (p: number) => void
}

/** Sebelumnya · 1 2 3 … N · Selanjutnya */
export function Pagination({ page, pageCount, onChange }: Props) {
  return (
    <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={`${pill} border-line-strong bg-white px-4 text-ink hover:bg-soft`}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Sebelumnya
      </button>
      {pages(page, pageCount).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className={`${pill} grid place-items-center border-line-strong bg-white text-muted`}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
            className={`${pill} ${
              p === page
                ? 'border-primary bg-primary text-white'
                : 'border-line-strong bg-white text-ink hover:bg-soft'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={`${pill} border-line-strong bg-white px-4 text-ink hover:bg-soft`}
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        Selanjutnya
      </button>
    </nav>
  )
}

/** Sebelumnya (putih) · Selanjutnya (biru) — dipakai tabel di tab Kinerja */
export function PrevNext({ page, pageCount, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="h-10 rounded-lg border border-line-strong bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-soft disabled:pointer-events-none disabled:opacity-45"
      >
        Sebelumnya
      </button>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:bg-primary-pressed disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-ink"
      >
        Selanjutnya
      </button>
    </div>
  )
}
