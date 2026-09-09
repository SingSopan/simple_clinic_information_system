import { LayoutDashboard, LogOut, Stethoscope, Users, ClipboardPlus, ListOrdered, UserCog, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import { logoutRequest } from '../../features/auth/services/authService.js'

const menus = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran'] },
  { to: '/users', label: 'Manajemen User', icon: UserCog, roles: ['Superadmin'] },
  { to: '/pasien', label: 'Data Pasien', icon: Users, roles: ['Superadmin', 'Administrator', 'Petugas Pendaftaran'] },
  { to: '/pendaftaran', label: 'Pendaftaran', icon: ClipboardPlus, roles: ['Superadmin', 'Administrator', 'Petugas Pendaftaran'] },
  { to: '/antrean', label: 'Antrean', icon: ListOrdered, roles: ['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran'] },
  { to: '/pemeriksaan', label: 'Pemeriksaan', icon: Stethoscope, roles: ['Superadmin', 'Administrator', 'Dokter'] },
]
export default function Sidebar({ collapsed, onClose }) {
  const { user, role, logout } = useAuthStore(); const navigate = useNavigate()
  const leave = async () => { try { await logoutRequest() } finally { logout(); navigate('/login') } }
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Stethoscope size={22} />
        </div>
        <button className="sidebar-close" onClick={onClose} aria-label="Tutup sidebar"><X size={20} /></button>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">Mini Clinic</span>
          <span className="sidebar-logo-sub">Sistem Informasi Klinik</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu Utama</div>
        {menus
          .filter((item) => item.roles.includes(role))
          .map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="sidebar-item" onClick={onClose} title={collapsed ? label : undefined}>
              <Icon className="sidebar-icon" size={19} />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.slice(0, 1)}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{user?.name}</div>
            <div className="sidebar-role">{role}</div>
          </div>
        </div>
        <button className="sidebar-item logout-button" onClick={leave}>
          <LogOut className="sidebar-icon" size={19} />
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </aside>
  )
}
