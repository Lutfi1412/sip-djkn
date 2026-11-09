import { CircleUser, ClipboardList, LayoutGrid, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logoMark from '../../assets/logoSIP-mark.png'
import logoSip from '../../assets/logoSIP.png'
import { useAuth } from '../../context/AuthContext'
import { confirmLogout } from '../../lib/alert'

const NAV = [
  { to: '/monitoring/data', label: 'Monitoring Data', icon: LayoutGrid },
  { to: '/monitoring/kinerja', label: 'Kinerja Penilaian', icon: ClipboardList },
]

interface Props {
  collapsed: boolean
  mobileOpen: boolean
  onNavigate: () => void
}

export function Sidebar({ collapsed, mobileOpen, onNavigate }: Props) {
  const { role, signOut } = useAuth()
  // di layar kecil sidebar selalu tampil penuh (drawer)
  const slim = collapsed

  const logout = async () => {
    if (await confirmLogout()) signOut()
  }

  return (
    <aside
      aria-label="Menu utama"
      className={`fixed bottom-2 left-2 top-2 z-50 flex w-[248px] flex-col rounded-[22px] bg-navy py-5 text-white shadow-xl transition-[width,transform] duration-300 lg:bottom-3 lg:left-3 lg:top-3 lg:shadow-none ${
        slim ? 'lg:w-16' : 'lg:w-[248px]'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'}`}
    >
      {/* Logo */}
      <div className={`flex h-14 items-center ${slim ? 'lg:justify-center lg:px-0' : ''} px-4`}>
        <img src={logoSip} alt="SIP DJKN — Sistem Informasi Penilaian DJKN" className={`h-14 w-auto ${slim ? 'lg:hidden' : ''}`} />
        <img src={logoMark} alt="SIP DJKN" className={`hidden h-8 w-auto ${slim ? 'lg:block' : ''}`} />
      </div>

      {/* Menu */}
      <p className={`mt-7 px-5 text-xs font-semibold ${slim ? 'lg:hidden' : ''}`}>Menu Monitoring Data</p>
      <nav className={`mt-3 flex flex-col gap-1.5 px-3 ${slim ? 'lg:mt-8' : ''}`}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={slim ? label : undefined}
            className={({ isActive }) =>
              `group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                slim ? 'lg:justify-center lg:px-0' : ''
              } ${isActive ? 'bg-white text-navy shadow-sm' : 'text-white/90 hover:bg-white/10'}`
            }
          >
            <Icon className="size-[18px] shrink-0" aria-hidden />
            <span className={slim ? 'lg:sr-only' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Keluar + role aktif */}
      <div className="px-3">
        <div className="border-t border-white/30" />
        <button
          type="button"
          onClick={logout}
          title={slim ? 'Keluar' : undefined}
          className={`mt-3 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10 ${
            slim ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          <LogOut className="size-[18px] shrink-0" aria-hidden />
          <span className={slim ? 'lg:sr-only' : ''}>Keluar</span>
        </button>

        <div
          title={slim ? `${role?.label ?? 'Role'} · Role Aktif` : undefined}
          className={`mt-3 flex items-center gap-2.5 rounded-xl bg-role p-2.5 ${
            slim ? 'lg:size-10 lg:justify-center lg:p-0' : ''
          } lg:mx-0`}
        >
          <CircleUser className="size-7 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
          <div className={`min-w-0 leading-tight ${slim ? 'lg:hidden' : ''}`}>
            <p className="truncate text-[11px] font-bold text-black">{role?.label ?? 'Monitoring Kanwil'}</p>
            <p className="mt-0.5 text-[10px] font-medium text-link">Role Aktif</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
