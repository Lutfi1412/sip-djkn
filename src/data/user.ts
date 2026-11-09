export interface Role {
  id: string
  label: string
  /** false = role dummy yang belum punya modul */
  ready: boolean
}

export const ROLES: Role[] = [
  { id: 'monitoring-kanwil', label: 'Monitoring Kanwil', ready: true },
  { id: 'dummy-2', label: 'Dummy 2', ready: false },
  { id: 'dummy-3', label: 'Dummy 3', ready: false },
]

/** Akun demo untuk login langkah 1 */
export const DEMO_LOGIN = { username: 'yanuar', password: 'sip2026' }

/** Data pengguna dummy untuk langkah 2 login (sesuai desain) */
export const DUMMY_USER = {
  nip: '198701072008121002',
  nama: 'Yanuar Rizki Sumardyanto',
}

/** Nama yang tampil di top bar (sesuai desain) */
export const TOPBAR_USER = 'AHMAD MAULANA'
