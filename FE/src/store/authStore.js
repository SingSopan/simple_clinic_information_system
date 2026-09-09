import { create } from 'zustand'

/**
 * Global auth store using Zustand.
 * Stores authenticated user info, role, and JWT token.
 */
const savedUser = localStorage.getItem('clinic_user')

const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', user.role)
    localStorage.setItem('clinic_user', JSON.stringify(user))
    set({ user, token, role: user.role })
  },

  setUser: (user) => {
    localStorage.setItem('role', user.role)
    localStorage.setItem('clinic_user', JSON.stringify(user))
    set({ user, role: user.role })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('clinic_user')
    set({ user: null, token: null, role: null })
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
}))

export default useAuthStore
