import Swal from 'sweetalert2'

const base = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'sip-swal',
    confirmButton: 'sip-swal-confirm',
    cancelButton: 'sip-swal-cancel',
  },
})

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2600,
  timerProgressBar: true,
  customClass: { popup: 'sip-swal-toast' },
})

export const toastSuccess = (title: string) => toast.fire({ icon: 'success', title })
export const toastInfo = (title: string) => toast.fire({ icon: 'info', title })
export const toastWarning = (title: string) => toast.fire({ icon: 'warning', title })

export const alertInfo = (title: string, text: string) =>
  base.fire({ icon: 'info', title, text, confirmButtonText: 'Mengerti', iconColor: '#216bc4' })

export async function confirmLogout() {
  const res = await base.fire({
    icon: 'question',
    iconColor: '#216bc4',
    title: 'Keluar dari aplikasi?',
    text: 'Sesi Anda akan diakhiri dan Anda kembali ke halaman login.',
    showCancelButton: true,
    confirmButtonText: 'Ya, keluar',
    cancelButtonText: 'Batal',
    focusCancel: true,
  })
  return res.isConfirmed
}
