import useClinicStore, { today } from '../../../store/clinicStore.js'

export default function Dashboard() {
  const { patients, visits } = useClinicStore()
  const daily = visits.filter((visit) => visit.date === today)
  const stats = [
    ['♙', 'Total Pasien', patients.length, 'Seluruh pasien terdaftar', '#4f86f7', '#dbeafe'],
    ['◷', 'Pasien Hari Ini', daily.length, 'Kunjungan hari ini', '#06b6d4', '#cffafe'],
    ['☷', 'Antrean Hari Ini', daily.length, 'Nomor antrean diterbitkan', '#8b5cf6', '#ede9fe'],
    ['◌', 'Menunggu', daily.filter((visit) => visit.status === 'Menunggu').length, 'Belum check in', '#f59e0b', '#fef3c7'],
    ['✓', 'Selesai Dilayani', daily.filter((visit) => visit.status === 'Selesai').length, 'Pemeriksaan telah selesai', '#10b981', '#d1fae5'],
  ]
  return <><div className="page-header"><div><h1 className="page-title"><span>▦</span> Dashboard</h1><p className="text-muted">Ringkasan aktivitas klinik hari ini.</p></div></div><section className="stat-grid">{stats.map(([icon, label, value, sub, color, bg]) => <article className="stat-card" key={label} style={{ '--stat-color': color, '--stat-bg': bg }}><div className="stat-icon-wrap">{icon}</div><div className="stat-info"><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-sub">{sub}</div></div></article>)}</section><section className="card"><div className="card-header"><div><h2>Antrean terbaru</h2><p className="text-muted small-text">Kunjungan pada {new Date().toLocaleDateString('id-ID')}</p></div></div><div className="table-wrapper"><table><thead><tr><th>Antrean</th><th>Pasien</th><th>Poli</th><th>Dokter</th><th>Status</th></tr></thead><tbody>{daily.length ? daily.map((visit) => { const patient = patients.find((item) => item.id === visit.patientId); return <tr key={visit.id}><td><strong className="font-mono">{visit.queueNumber}</strong></td><td>{patient?.name || '-'}</td><td>{visit.poli}</td><td>{visit.doctor}</td><td><Status value={visit.status} /></td></tr> }) : <tr><td colSpan="5" className="text-center text-muted">Belum ada antrean hari ini.</td></tr>}</tbody></table></div></section></>
}
export function Status({ value }) { const classes = { Menunggu: 'badge-waiting', 'Check In': 'badge-checkin', Pemeriksaan: 'badge-examination', Selesai: 'badge-done' }; return <span className={`badge ${classes[value] || 'badge-gray'}`}>{value}</span> }
