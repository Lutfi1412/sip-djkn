import { useCallback, useEffect, useRef, useState } from 'react'

export const LOADING_MS = 1500

/**
 * Simulasi loading 1,5 detik untuk setiap sub modul.
 * - Otomatis berjalan saat halaman dibuka.
 * - `run(cb)` memicu loading lagi; `cb` dijalankan setelah selesai (mis. menerapkan filter).
 * - `done` bertambah setiap loading selesai → dipakai sebagai `key` agar grafik beranimasi ulang.
 */
export function useSimulatedLoading() {
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const run = useCallback((onDone?: () => void) => {
    window.clearTimeout(timer.current)
    setLoading(true)
    timer.current = window.setTimeout(() => {
      onDone?.()
      setLoading(false)
      setDone((n) => n + 1)
    }, LOADING_MS)
  }, [])

  useEffect(() => {
    run()
    return () => window.clearTimeout(timer.current)
  }, [run])

  return { loading, done, run }
}
