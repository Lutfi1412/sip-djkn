import { ChevronDown, Eye, EyeOff, FileText, Loader2, Lock, ShieldCheck, User } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import bgLogin from '../assets/backgroundlogin.jpg'
import logoKemenkeu from '../assets/Logokemenkeu.png'
import logoSip from '../assets/logoSIP.png'
import { btnPrimary, btnSecondary } from '../components/ui/buttons'
import { useAuth } from '../context/AuthContext'
import { DEMO_LOGIN, ROLES } from '../data/user'
import { alertInfo, toastInfo } from '../lib/alert'
import { LOADING_MS } from '../hooks/useSimulatedLoading'

function IconInput(props: {
  id: string
  label: string
  icon?: ReactNode
  type?: string
  value: string
  placeholder?: string
  readOnly?: boolean
  onChange?: (v: string) => void
  trailing?: ReactNode
  invalid?: boolean
  autoComplete?: string
}) {
  const { id, label, icon, type = 'text', value, placeholder, readOnly, onChange, trailing, invalid, autoComplete } = props
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={`h-11 w-full rounded-lg border ${icon ? 'pl-10' : 'pl-3'} pr-10 text-sm text-ink placeholder:text-muted/80 transition-colors focus:outline-none focus:ring-2 ${
            readOnly
              ? 'border-line bg-detail'
              : invalid
                ? 'border-bad bg-white focus:border-bad focus:ring-bad/20'
                : 'border-line-strong bg-white hover:border-brand/60 focus:border-focus focus:ring-focus/25'
          }`}
        />
        {trailing && <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>}
      </div>
    </div>
  )
}

/** Langkah 1 — Selamat datang */
function StepWelcome({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.')
      return
    }
    if (username.trim().toLowerCase() !== DEMO_LOGIN.username || password !== DEMO_LOGIN.password) {
      setError('Username atau password salah.')
      return
    }
    setError('')
    setBusy(true)
    window.setTimeout(onDone, LOADING_MS)
  }

  return (
    <form onSubmit={submit} noValidate className="animate-pop">
      <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-link">
        <Lock className="size-3" aria-hidden /> LANGKAH 1 DARI 2
      </p>
      <h2 className="mt-4 text-2xl font-bold text-ink">Selamat datang</h2>
      <p className="mt-1.5 text-xs text-muted">Masuk untuk mengakses layanan penilaian.</p>

      <div className="mt-6 space-y-4">
        <IconInput
          id="username"
          label="Username"
          icon={<User className="size-4" />}
          value={username}
          onChange={setUsername}
          placeholder="Masukkan username"
          autoComplete="username"
          invalid={!!error}
        />
        <IconInput
          id="password"
          label="Password"
          icon={<Lock className="size-4" />}
          type={show ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Masukkan password"
          autoComplete="current-password"
          invalid={!!error}
          trailing={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
              className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className={`${btnPrimary} mt-5 h-11 w-full`}>
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Memproses…
          </>
        ) : (
          'Masuk'
        )}
      </button>

      <p className="my-4 text-center text-[10px] text-muted">atau masuk melalui SSO</p>
      <div className="space-y-2.5">
        {['SSO DJKN', 'SSO Kemenkeu'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toastInfo(`${s} belum tersedia pada prototipe ini`)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-white text-xs font-semibold text-ink transition-colors hover:bg-soft"
          >
            <ShieldCheck className="size-4 text-link" aria-hidden /> {s}
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-[11px] text-muted">
        Belum punya akun?{' '}
        <button
          type="button"
          onClick={() => alertInfo('Pendaftaran', 'Pendaftaran akun belum tersedia pada prototipe ini.')}
          className="font-semibold text-link hover:underline"
        >
          Daftar di sini
        </button>
      </p>
    </form>
  )
}

/** Langkah 2 — Pilih akses (role) */
function StepRole({ nip, nama, onBack }: { nip: string; nama: string; onBack: () => void }) {
  const { chooseRole } = useAuth()
  const navigate = useNavigate()
  const [roleId, setRoleId] = useState(ROLES[0].id)

  const enter = () => {
    const role = ROLES.find((r) => r.id === roleId)!
    if (!role.ready) {
      alertInfo('Role belum tersedia', `Modul untuk role "${role.label}" masih berupa dummy. Pilih "Monitoring Kanwil" untuk melanjutkan.`)
      return
    }
    chooseRole(role.id)
    navigate('/monitoring/data', { replace: true })
  }

  return (
    <div className="animate-pop">
      <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-link">
        <Lock className="size-3" aria-hidden /> LANGKAH 2 DARI 2
      </p>
      <h2 className="mt-4 text-2xl font-bold text-ink">Pilih akses Anda</h2>
      <p className="mt-1.5 text-xs text-muted">Pilih role untuk melanjutkan ke aplikasi.</p>

      <div className="mt-6 space-y-4">
        <IconInput id="nip" label="NIP" icon={<User className="size-4" />} value={nip} readOnly />
        <IconInput id="nama" label="Nama" value={nama} readOnly />
        <div>
          <label htmlFor="role" className="mb-1.5 block text-[11px] font-semibold text-ink">
            Role aktif
          </label>
          <div className="relative">
            <FileText aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <select
              id="role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-line-strong bg-white pl-10 pr-10 text-sm text-ink transition-colors hover:border-brand/60 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/25"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink" />
          </div>
        </div>
      </div>

      <button type="button" onClick={enter} className={`${btnPrimary} mt-5 h-11 w-full`}>
        Masuk ke aplikasi
      </button>
      <button type="button" onClick={onBack} className={`${btnSecondary} mt-3 h-11 w-full`}>
        Kembali ke Login
      </button>
    </div>
  )
}

export default function LoginPage() {
  const { session, signIn, signOut } = useAuth()

  // sudah punya role → langsung ke aplikasi
  if (session?.roleId) return <Navigate to="/monitoring/data" replace />

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy text-white">
      <img src={bgLogin} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
      {/* Gradien Login #123A60 → #2578C6 di atas foto gedung */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,58,96,.66) 0%, rgba(18,58,96,.52) 55%, rgba(37,120,198,.92) 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-start justify-between gap-4 px-6 pt-7 sm:px-12">
          <img src={logoKemenkeu} alt="Kementerian Keuangan Republik Indonesia" className="h-11 w-auto sm:h-14" />
          <img src={logoSip} alt="SIP DJKN — Sistem Informasi Penilaian DJKN" className="h-11 w-auto sm:h-14" />
        </header>

        <main className="grid flex-1 items-center gap-10 px-6 py-10 sm:px-12 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
          <section className="hidden lg:block">
            <p className="text-lg font-medium uppercase tracking-wide">Sistem Informasi Penilaian</p>
            <h1 className="mt-4 max-w-[560px] text-[44px] font-bold leading-[1.15]">
              Penilaian terintegrasi Informasi dalam satu akses.
            </h1>
            <p className="mt-6 max-w-[520px] text-2xl font-light leading-snug text-white/95">
              Direktorat Jenderal Kekayaan Negara Kementerian Keuangan Republik Indonesia
            </p>
          </section>

          <div className="mx-auto w-full max-w-[420px] rounded-2xl bg-white p-7 text-ink shadow-pop sm:p-8 lg:mx-0 lg:justify-self-end">
            {session ? (
              <StepRole key="role" nip={session.nip} nama={session.nama} onBack={signOut} />
            ) : (
              <StepWelcome key="welcome" onDone={signIn} />
            )}
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 px-6 pb-5 text-[11px] text-white/90 sm:px-12">
          <span>© 2026 SIP DJKN · Direktorat Jenderal Kekayaan Negara</span>
          <span>Kementerian Keuangan Republik Indonesia</span>
        </footer>
      </div>
    </div>
  )
}
