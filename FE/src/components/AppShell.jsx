import Sidebar from './Sidebar/Sidebar.jsx'
import Navbar from './Navbar/Navbar.jsx'
import { useEffect, useState } from 'react'
import useClinicStore from '../store/clinicStore.js'

export default function AppShell({ children }) {
  const hydrate = useClinicStore((state) => state.hydrate)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => { hydrate() }, [hydrate])
  const toggleSidebar = () => {
    if (window.matchMedia('(max-width: 768px)').matches) return setMobileOpen((open) => !open)
    setCollapsed((current) => { const next = !current; localStorage.setItem('sidebar_collapsed', String(next)); return next })
  }
  return <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
    <Sidebar collapsed={collapsed} onClose={() => setMobileOpen(false)} />
    <button className="sidebar-overlay" aria-label="Tutup sidebar" onClick={() => setMobileOpen(false)} />
    <section className="app-content">
      <Navbar collapsed={collapsed} mobileOpen={mobileOpen} onToggleSidebar={toggleSidebar} />
      <main className="app-main">{children}</main>
    </section>
  </div>
}
