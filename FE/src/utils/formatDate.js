/**
 * Utility – Date & Time Formatters
 */

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']

/**
 * Format tanggal menjadi "DD MMM YYYY"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Format tanggal dan waktu menjadi "DD MMM YYYY HH:mm"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} ${hours}:${minutes}`
}

/**
 * Format tanggal untuk input type="date" (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export function toInputDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Hitung umur berdasarkan tanggal lahir
 * @param {string|Date} birthDate
 * @returns {string}
 */
export function calcAge(birthDate) {
  if (!birthDate) return '-'
  const d = new Date(birthDate)
  if (isNaN(d.getTime())) return '-'
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return `${age} tahun`
}

/**
 * Format waktu saat ini HH:mm:ss
 * @returns {string}
 */
export function formatTimeNow() {
  const d = new Date()
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
