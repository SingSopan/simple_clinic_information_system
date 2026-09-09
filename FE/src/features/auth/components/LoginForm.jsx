import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore.js'
import useLogin from '../hooks/useLogin.js'

export default function Login() {
  const navigate = useNavigate(); const { token } = useAuthStore(); const login = useLogin()
  const [form, setForm] = useState({ email: 'admin@klinik.test', password: 'admin123' }); const [error, setError] = useState('')
  if (token) return <Navigate to="/" replace />
  const submit = (event) => { event.preventDefault(); const result = login(form); if (result.error) return setError(result.error); navigate('/') }
  return <main className="login-page"><form className="login-card" onSubmit={submit}><div className="login-logo"><div className="login-logo-icon">✚</div><h1 className="login-title">Mini Clinic</h1><p className="login-subtitle">Masuk ke sistem informasi klinik</p></div>{error && <div className="login-error">⚠ {error}</div>}<div className="form-group"><label className="form-label">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><div className="form-group"><label className="form-label">Kata sandi</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div><button className="btn btn-primary btn-full btn-lg" type="submit">Masuk</button><div className="demo-accounts"><strong>Akun demo</strong><span>Admin: admin@klinik.test / admin123</span><span>Dokter: dokter@klinik.test / dokter123</span><span>Petugas: petugas@klinik.test / petugas123</span></div></form></main>
}
