import { createPortal } from 'react-dom'
import loadingGif from '../../assets/loadingscreen.gif'

/**
 * Overlay loading memakai asset resmi `loadingscreen.gif`.
 * Latar putih GIF dilebur (mix-blend multiply) agar menyatu dengan overlay.
 */
export function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-label="Memuat data"
      className="fixed inset-0 z-[100] grid animate-fade place-items-center bg-canvas/80"
    >
      <img
        src={loadingGif}
        alt=""
        draggable={false}
        className="w-[min(280px,70vw)] select-none mix-blend-multiply"
      />
      <span className="sr-only">Memuat data…</span>
    </div>,
    document.body,
  )
}
