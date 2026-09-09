import useAuthStore from '../../../store/authStore.js'
import { logoutRequest } from '../services/authService.js'

export default function useLogout() {
  const authStore = useAuthStore()

  return async function logout() {
    try {
      await logoutRequest()
    } catch (error) {
      console.error('Logout error:', error)
      // Don't block UI reset on server error
    } finally {
      authStore.logout()
      window.location.href = '/login'
    }
  }
}
