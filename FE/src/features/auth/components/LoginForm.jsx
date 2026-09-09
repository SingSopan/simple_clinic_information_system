import { AlertCircle, LogIn, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore.js'
import useLogin from '../hooks/useLogin.js'

export default function LoginForm() {
  const navigate = useNavigate(); 
  const { token } = useAuthStore(); 
  const login = useLogin(); 
  const [form, setForm] = useState({ email: '', password: '' }); 
  const [error, setError] = useState('')
  if (token) return <Navigate to="/" replace />
  const submit = async (event) => { event.preventDefault(); 
    const result = await login(form); 
    if (result.error) return setError(result.error); 
    navigate('/') 
  }
  return <main className="login-page">
    <form className="login-card" onSubmit={submit}>
      <div className="login-logo">
        <div className="login-logo-icon"><Stethoscope size={32} /></div>
        <h1 className="login-title">Mini Clinic</h1>
        <p className="login-subtitle">Masuk ke sistem informasi klinik</p>
      </div>

      {error && <div className="login-error"><AlertCircle size={17} /> {error}</div>}
      
      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>

        <div className="form-group">
        <label className="form-label">Kata sandi</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      <button className="btn btn-primary btn-full btn-lg" type="submit"><LogIn size={18} /> Masuk</button>
      
    </form>
  </main>
}
