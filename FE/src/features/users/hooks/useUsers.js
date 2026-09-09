import { useCallback, useEffect, useState } from 'react'
import { userService } from '../services/userService.js'

export default function useUsers() {
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('')
  const load = useCallback(async () => { setLoading(true); try { const response = await userService.list(); setUsers(response.data.data); setError('') } catch (requestError) { setError(requestError.response?.data?.message || 'Gagal memuat user.') } finally { setLoading(false) } }, [])
  useEffect(() => { load() }, [load])
  const create = async (data) => { try { await userService.create(data); await load(); return {} } catch (requestError) { return { error: requestError.response?.data?.message || 'Gagal membuat user.' } } }
  const update = async (id, data) => { try { await userService.update(id, data); await load(); return {} } catch (requestError) { return { error: requestError.response?.data?.message || 'Gagal memperbarui user.' } } }
  const remove = async (id) => { try { await userService.remove(id); await load(); return {} } catch (requestError) { return { error: requestError.response?.data?.message || 'Gagal menghapus user.' } } }
  return { users, loading, error, create, update, remove }
}
