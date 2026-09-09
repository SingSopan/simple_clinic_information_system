import { Pencil, Plus, Trash2, UserCog } from 'lucide-react'
import { useState } from 'react'
import Modal from '../../../components/Modal/Modal.jsx'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner.jsx'
import useUsers from '../hooks/useUsers.js'
import useClinicStore from '../../../store/clinicStore.js'

const empty = { name: '', email: '', password: '', role: '', isActive: true }

export default function UserManager() {
  const { users, loading, error: loadError, create, update, remove } = useUsers()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const roles = useClinicStore((state) => state.referenceData.userRoles)

  const open = (mode, user = empty) => {
    setModal(mode)
    setForm(mode === 'edit' ? { ...user, password: '' } : { ...empty, role: roles[0] || '' })
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const result = modal === 'edit' ? await update(form.id, form) : await create(form)
    if (result.error) return setError(result.error)
    setModal(null)
  }

  const deleteUser = async (user) => {
    if (!window.confirm(`Hapus user ${user.name}?`)) return
    const result = await remove(user.id)
    if (result.error) window.alert(result.error)
  }

  if (loading) return <LoadingSpinner text="Memuat data user..." />

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCog size={25} /> Manajemen User
          </h1>
          <p className="text-muted">Buat akun dan tentukan hak akses pengguna.</p>
        </div>
        <button className="btn btn-primary" onClick={() => open('add')}>
          <Plus size={17} /> Tambah User
        </button>
      </div>

      {loadError && <div className="login-error">{loadError}</div>}

      <section className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-info">{user.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-gray'}`}>
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-outline btn-sm" onClick={() => open('edit', user)}>
                        <Pencil size={14} /> Ubah
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user)}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Belum ada user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <Modal title={modal === 'add' ? 'Tambah User' : 'Ubah User'} onClose={() => setModal(null)}>
          <form onSubmit={submit}>
            <div className="modal-body">
              {error && <div className="login-error">{error}</div>}
              <div className="form-grid">
                <Field
                  label="Nama"
                  value={form.name}
                  onChange={(name) => setForm({ ...form, name })}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(email) => setForm({ ...form, email })}
                  required
                />
                <Field
                  label={modal === 'add' ? 'Password' : 'Password baru (opsional)'}
                  type="password"
                  value={form.password}
                  onChange={(password) => setForm({ ...form, password })}
                  required={modal === 'add'}
                />
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    value={form.role}
                    onChange={(event) => setForm({ ...form, role: event.target.value })}
                  >
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </div>
                {modal === 'edit' && (
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                    />{' '}
                    User aktif
                  </label>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>
                Batal
              </button>
              <button className="btn btn-primary" type="submit">
                Simpan User
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </div>
  )
}
