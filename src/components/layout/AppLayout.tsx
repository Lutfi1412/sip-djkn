import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  const toggle = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) setCollapsed((c) => !c)
    else setMobileOpen((o) => !o)
  }

  return (
    <div className="min-h-screen bg-canvas p-2 lg:p-3">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 animate-fade bg-scrim/[.43] lg:hidden"
        />
      )}
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />

      <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'}`}>
        <div className="sticky top-0 z-30 -mx-2 -mt-2 bg-canvas px-2 pt-2 lg:-mx-3 lg:-mt-3 lg:px-3 lg:pt-3">
          <Topbar onToggleSidebar={toggle} />
        </div>
        <main key={pathname} className="animate-rise px-1 pb-4 pt-6 sm:px-2">
          <Outlet />
        </main>
        <footer className="px-2 pb-2 text-[13px] text-ink">
          Dikembangkan dan dikelola oleh Subdit PISA, Direktorat TSI ©PISA III 2026
        </footer>
      </div>
    </div>
  )
}
