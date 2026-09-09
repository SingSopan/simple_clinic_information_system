import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import PatientListPage from './pages/patients/PatientListPage.jsx'
import RegistrationPage from './pages/registration/RegistrationPage.jsx'
import QueuePage from './pages/queue/QueuePage.jsx'
import ExaminationPage from './pages/examination/ExaminationPage.jsx'
import UserListPage from './pages/users/UserListPage.jsx'

function SecurePage({ roles, children }) {
  return <ProtectedRoute roles={roles}><AppShell>{children}</AppShell></ProtectedRoute>
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<SecurePage roles={['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran']}><DashboardPage /></SecurePage>} />
    <Route path="/users" element={<SecurePage roles={['Superadmin']}><UserListPage /></SecurePage>} />
    <Route path="/pasien" element={<SecurePage roles={['Superadmin', 'Administrator', 'Petugas Pendaftaran']}><PatientListPage /></SecurePage>} />
    <Route path="/pendaftaran" element={<SecurePage roles={['Superadmin', 'Administrator', 'Petugas Pendaftaran']}><RegistrationPage /></SecurePage>} />
    <Route path="/antrean" element={<SecurePage roles={['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran']}><QueuePage /></SecurePage>} />
    <Route path="/pemeriksaan" element={<SecurePage roles={['Superadmin', 'Administrator', 'Dokter']}><ExaminationPage /></SecurePage>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
