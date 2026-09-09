import { useMemo, useState } from 'react'
import useClinicStore from '../../../store/clinicStore.js'
import { calcAge, formatDate } from '../../../utils/formatDate.js'
import Modal from '../../../components/Modal/Modal.jsx'
import Pagination from '../../../components/Pagination/Pagination.jsx'
import { Plus } from 'lucide-react'

const blank = { nik: '', name: '', gender: 'Laki-laki', birthDate: '', phone: '', address: '' }
export default function Patients() {
  const { patients, addPatient, updatePatient, removePatient } = useClinicStore(); 
  const [search, setSearch] = useState(''); 
  const [page, setPage] = useState(1); 
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState(blank); 
  const [error, setError] = useState('')
  const filtered = useMemo(() => 
    patients.filter((patient) => 
      `${patient.name} ${patient.nik} ${patient.mrn}`.toLowerCase().includes(search.toLowerCase())), 
      [patients, search]); 
  const rows = filtered.slice((page - 1) * 5, page * 5)
  const open = (type, patient = null) => { setError(''); setModal(type); setForm(patient ? { ...patient } : blank) }
  const submit = async (event) => { 
    event.preventDefault(); const result = modal === 'add' ? await addPatient(form) : await updatePatient(form.id, form); 
    if (result?.error) return setError(result.error); 
    setModal(null) }
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Master Data Pasien</h1>
          <p className="text-muted">Kelola data dan rekam medis pasien.</p>
        </div>
        <button className="btn btn-primary" onClick={() => open('add')}>
          <Plus/>
          Tambah Pasien
        </button>
      </div>

      <section className="card">
        <div className="card-header">
          <div className="filter-bar">
            <input
              className="search-input"
              placeholder="Cari nama, NIK, atau no. rekam medis..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <span className="text-muted">{filtered.length} pasien</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No. RM</th>
                <th>Pasien</th>
                <th>NIK</th>
                <th>Jenis Kelamin</th>
                <th>Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((patient) => (
                <tr key={patient.id}>
                  <td className="font-mono">{patient.mrn}</td>
                  <td>
                    <strong>{patient.name}</strong>
                    <br />
                    <span className="small-text text-muted">{calcAge(patient.birthDate)}</span>
                  </td>
                  <td>{patient.nik}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => open('detail', patient)}
                      >
                        Detail
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => open('edit', patient)}
                      >
                        Ubah
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          if (window.confirm(`Hapus data ${patient.name}?`))
                            { const result = await removePatient(patient.id); if (result.error) setError(result.error) }
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Data pasien tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} total={filtered.length} onChange={setPage} />
      </section>

      {(modal === 'add' || modal === 'edit') && (
        <Modal
          title={modal === 'add' ? 'Tambah Data Pasien' : 'Ubah Data Pasien'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={submit}>
            <div className="modal-body">
              <p className="auto-note">Nomor rekam medis dibuat otomatis saat data disimpan.</p>
              {error && <div className="form-error">⚠ {error}</div>}
              <div className="form-grid">
                <Field
                  label="NIK"
                  value={form.nik}
                  onChange={(nik) => setForm({ ...form, nik })}
                  required
                />
                <Field
                  label="Nama Pasien"
                  value={form.name}
                  onChange={(name) => setForm({ ...form, name })}
                  required
                />
                <div className="form-group">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <Field
                  label="Tanggal Lahir"
                  type="date"
                  value={form.birthDate}
                  onChange={(birthDate) => setForm({ ...form, birthDate })}
                  required
                />
                <Field
                  label="Nomor Telepon"
                  type="tel"
                  value={form.phone}
                  onChange={(phone) => setForm({ ...form, phone })}
                  required
                />
                <div className="form-group">
                  <label className="form-label">Alamat</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>
                Batal
              </button>
              <button className="btn btn-primary" type="submit">
                Simpan Data
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'detail' && (
        <Modal title="Detail Pasien" onClose={() => setModal(null)}>
          <div className="modal-body detail-list">
            <Detail label="No. Rekam Medis" value={form.mrn} />
            <Detail label="NIK" value={form.nik} />
            <Detail label="Nama" value={form.name} />
            <Detail label="Jenis Kelamin" value={form.gender} />
            <Detail
              label="Tanggal Lahir"
              value={`${formatDate(form.birthDate)} (${calcAge(form.birthDate)})`}
            />
            <Detail label="Telepon" value={form.phone} />
            <Detail label="Alamat" value={form.address} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={() => setModal(null)}>
              Tutup
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
function Field({ label, type = 'text', value, onChange, required }) { 
  return <div className="form-group">
    <label className="form-label">{label}{required && <span className="required">*</span>}
    </label>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </div> 
}
function Detail({ label, value }) { 
  return <div><span>{label}</span><strong>{value}</strong></div> 
}
