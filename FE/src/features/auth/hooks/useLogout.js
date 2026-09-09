import useAuthStore from '../../../store/authStore.js'
export default function useLogout() { return useAuthStore((state) => state.logout) }
