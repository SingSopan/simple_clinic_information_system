import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
const titles = { '/': 'Dashboard', '/pasien': 'Data Pasien', '/pendaftaran': 'Pendaftaran', '/antrean': 'Antrean', '/pemeriksaan': 'Pemeriksaan' }
export default function Navbar() {
  const location = useLocation(); const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  return <header className="navbar"><div className="navbar-breadcrumb"><span>Mini Clinic</span><span> / </span><span className="current">{titles[location.pathname] || 'Dashboard'}</span></div><div className="navbar-actions"><span className="navbar-time">{time.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} · {time.toLocaleTimeString('id-ID')}</span></div></header>
}
