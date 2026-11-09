import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AuthProvider, useAuth } from './context/AuthContext'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const MonitoringDataPage = lazy(() => import('./pages/MonitoringDataPage'))
const KinerjaPage = lazy(() => import('./pages/KinerjaPage'))

/** Hanya bisa diakses setelah login (langkah 1) dan memilih role (langkah 2) */
function RequireRole() {
  const { session } = useAuth()
  return session?.roleId ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireRole />}>
              <Route element={<AppLayout />}>
                <Route path="/monitoring/data" element={<MonitoringDataPage />} />
                <Route path="/monitoring/kinerja" element={<KinerjaPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/monitoring/data" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
