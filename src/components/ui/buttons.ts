const base =
  'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors disabled:pointer-events-none'

/** Tombol utama — #175EA8, hover #124C81, pressed #123A60 */
export const btnPrimary = `${base} bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed disabled:bg-disabled disabled:text-disabled-ink`

/** Tombol sekunder — putih + garis biru */
export const btnSecondary = `${base} border border-brand bg-white text-brand hover:bg-soft active:bg-soft disabled:border-line disabled:bg-disabled disabled:text-disabled-ink`
