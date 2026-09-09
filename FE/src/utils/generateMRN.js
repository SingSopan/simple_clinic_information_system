/**
 * Utility – Generate Nomor Rekam Medis (MRN)
 * Format: RM-YYYYMM-XXXXX
 * Menggunakan counter yang disimpan di localStorage sebagai fallback
 * ketika backend belum tersedia.
 */

const MRN_KEY = 'clinic_mrn_counter'

/**
 * Generate Nomor Rekam Medis baru.
 * @returns {string} e.g. "RM-202609-00001"
 */
export function generateMRN() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `RM-${year}${month}`

  const raw = localStorage.getItem(MRN_KEY)
  const counter = raw ? parseInt(raw, 10) + 1 : 1
  localStorage.setItem(MRN_KEY, String(counter))

  const seq = String(counter).padStart(5, '0')
  return `${prefix}-${seq}`
}

/**
 * Generate nomor antrean.
 * Format: A001, A002, …
 * @param {number} seq – sequence number (1-based)
 * @returns {string}
 */
export function generateQueueNumber(seq) {
  return `A${String(seq).padStart(3, '0')}`
}

const QUEUE_KEY = 'clinic_queue_counter'

export function nextQueueNumber() {
  const raw = localStorage.getItem(QUEUE_KEY)
  const counter = raw ? parseInt(raw, 10) + 1 : 1
  localStorage.setItem(QUEUE_KEY, String(counter))
  return generateQueueNumber(counter)
}

export function resetQueueCounter() {
  localStorage.setItem(QUEUE_KEY, '0')
}
