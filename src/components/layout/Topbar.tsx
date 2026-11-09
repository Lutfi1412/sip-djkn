import { Bell, CircleUser, Info, PanelLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TOPBAR_USER } from '../../data/user'
import { useAuth } from '../../context/AuthContext'
import { alertInfo } from '../../lib/alert'

const CRUMB: Record<string, string> = {
  '/monitoring/data': 'Monitoring data',
  '/monitoring/kinerja': 'Kinerja Penilaian',
}

const NOTIF = [
  { t: 'Laporan LAP-007/KNL.0301/2026 telah diterbitkan', w: '5 menit lalu' },
  { t: '3 permohonan baru menunggu penugasan penilai', w: '1 jam lalu' },
  { t: 'Rekap kinerja bulan Oktober siap diunduh', w: 'Kemarin' },
]

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { pathname } = useLocation()
  const { role } = useAuth()
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="sticky top-2 z-30 flex h-14 items-center justify-between gap-3 rounded-2xl bg-navy px-4 text-white shadow-md lg:top-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka/tutup sidebar"
          className="grid size-7 shrink-0 place-items-center rounded-md border border-white/70 transition-colors hover:bg-white/15"
        >
          <PanelLeft className="size-4" />
        </button>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs">
          <Link to="/monitoring/data" className="underline underline-offset-2 hover:text-white/80">
            Beranda
          </Link>
          <span aria-hidden>&gt;</span>
          <span className="truncate">{CRUMB[pathname] ?? 'Monitoring data'}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div ref={box} className="relative">
          <button
            type="button"
            aria-label="Notifikasi"
            aria-expanded={open}
            onClick={() => {
              setOpen((o) => !o)
              setRead(true)
            }}
            className="relative grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15"
          >
            <Bell className="size-[18px] fill-white" />
            {!read && <span className="absolute right-1 top-1 size-2 rounded-full bg-notif ring-2 ring-navy" />}
          </button>
          {open && (
            <div className="absolute right-0 top-11 z-50 w-72 animate-pop rounded-xl border border-line bg-white p-2 text-ink shadow-pop sm:w-80">
              <p className="px-3 py-2 text-sm font-bold text-title">Notifikasi</p>
              <ul>
                {NOTIF.map((n) => (
                  <li key={n.t} className="rounded-lg px-3 py-2.5 hover:bg-row">
                    <p className="text-[13px] leading-snug">{n.t}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{n.w}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Informasi aplikasi"
          onClick={() => alertInfo('SIP DJKN', 'Sistem Informasi Penilaian — Direktorat Jenderal Kekayaan Negara. Versi prototipe dengan data dummy.')}
          className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15"
        >
          <Info className="size-[18px] fill-white text-navy" />
        </button>

        <div className="flex items-center gap-2.5">
          <CircleUser className="size-8 shrink-0" strokeWidth={1.5} aria-hidden />
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-bold tracking-wide">{TOPBAR_USER}</p>
            <p className="text-[11px] text-white/85">{role?.label ?? 'Monitoring Kanwil'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
