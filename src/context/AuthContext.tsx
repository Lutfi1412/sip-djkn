import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DUMMY_USER, ROLES, type Role } from '../data/user'

interface Session {
  nip: string
  nama: string
  roleId: string | null
}

interface AuthValue {
  session: Session | null
  role: Role | null
  /** Langkah 1 login selesai */
  signIn: () => void
  /** Langkah 2: pilih role */
  chooseRole: (roleId: string) => void
  signOut: () => void
}

const KEY = 'sip.session'
const AuthContext = createContext<AuthValue | null>(null)

function load(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function save(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s))
    else sessionStorage.removeItem(KEY)
  } catch {
    /* storage tidak tersedia — abaikan */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(load)

  const update = useCallback((s: Session | null) => {
    setSession(s)
    save(s)
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      role: ROLES.find((r) => r.id === session?.roleId) ?? null,
      signIn: () => update({ ...DUMMY_USER, roleId: null }),
      chooseRole: (roleId) => update(session ? { ...session, roleId } : null),
      signOut: () => update(null),
    }),
    [session, update],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
