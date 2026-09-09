import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
const titles = {
  '/': 'Dashboard',
  '/users': 'Manajemen User',
  '/pasien': 'Data Pasien',
  '/pendaftaran': 'Pendaftaran',
  '/antrean': 'Antrean',
  '/pemeriksaan': 'Pemeriksaan'
}
export default function Navbar({ collapsed, mobileOpen, onToggleSidebar }) 
{ 
  const location = useLocation(); 
  const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  return <header className="navbar">
    <div className="navbar-breadcrumb">
      <button className="navbar-sidebar-toggle" onClick={onToggleSidebar} aria-label={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'} title={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}>
        <span className="sidebar-toggle-desktop-icon">{collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}</span>
        <span className="sidebar-toggle-mobile-icon">{mobileOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}</span>
      </button>
      <span>Mini Clinic</span>
      <span> / </span>
      <span className="current">{titles[location.pathname] || 'Dashboard'}</span>
    </div>
    <div className="navbar-actions">
      <span className="navbar-time">
        {time.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} · {time.toLocaleTimeString('id-ID')}
      </span>
    </div>
  </header> 
}
