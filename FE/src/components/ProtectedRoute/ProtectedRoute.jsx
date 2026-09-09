import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'

export default function ProtectedRoute({ roles, children }) {
  const { token, role, user } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />
  return children
}
