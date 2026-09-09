export default function StatusBadge({ value }) {
  const classes = { Menunggu: 'badge-waiting', 'Check In': 'badge-checkin', Pemeriksaan: 'badge-examination', Selesai: 'badge-done' }
  return <span className={`badge ${classes[value] || 'badge-gray'}`}>{value}</span>
}
