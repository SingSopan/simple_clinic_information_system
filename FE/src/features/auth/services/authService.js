import api from '../../../services/api.js'
export const authenticate = async (credentials) => { 
    const { data } = await api.post('/login', credentials); 
    return data 
}
export const logoutRequest = () => api.post('/logout')
