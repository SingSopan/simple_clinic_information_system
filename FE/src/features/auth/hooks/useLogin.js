import useAuthStore from '../../../store/authStore.js'
import { authenticate, createMockJwt } from '../services/authService.js'
export default function useLogin() { const setAuth = useAuthStore((state) => state.setAuth); return (credentials) => { const account = authenticate(credentials); if (!account) return { error: 'Email atau kata sandi tidak sesuai.' }; setAuth({ name: account.name, email: account.email, role: account.role }, createMockJwt(account)); return { account } } }
