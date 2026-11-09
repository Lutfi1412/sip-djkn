import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
}

/** Modal card: scrim #0B1C32 @ 43%, Esc & klik di luar untuk menutup, scroll body dikunci */
export function Modal({ open, onClose, title, subtitle, children }: Props) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    // fokus ke kontrol pertama
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('select,input,button')?.focus(), 60)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[90] grid animate-fade place-items-center overflow-y-auto bg-scrim/[.43] p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-[680px] animate-pop rounded-2xl bg-white p-6 shadow-pop sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-title">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-link">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-lg text-ink transition-colors hover:bg-soft"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
