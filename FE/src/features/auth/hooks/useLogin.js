import useAuthStore from '../../../store/authStore.js'
import { authenticate } from '../services/authService.js'
export default function useLogin() 
{ 
    const setAuth = useAuthStore((state) => state.setAuth); 
    return async (credentials) => 
    { 
        try { 
            const result = await authenticate(credentials); 
            setAuth(result.user, result.token); 
            return { account: result.user } 
        } catch (error) { 
            return { error: error.response?.data?.message || 'Tidak dapat terhubung ke server.' } 
        } 
    } 
}
