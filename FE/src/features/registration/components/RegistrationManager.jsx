import { useState } from 'react'
import useClinicStore, { today } from '../../../store/clinicStore.js'
import { Status } from '../../dashboard/components/DashboardContent.jsx'
import Modal from '../../../components/Modal/Modal.jsx'
import { Form, Plus } from 'lucide-react'

const blank = { patientId: '', doctorId: '', poli: '', date: today, payment: '', complaint: '' }
export default function Registrations() {
  const { visits, patients, doctors, referenceData, addVisit, getPatient } = useClinicStore(); 
  const [modal, setModal] = useState(false); 
  const [form, setForm] = useState(blank)
  const submit = async (event) => { 
    event.preventDefault(); 
    const result = await addVisit({ ...form, patientId: Number(form.patientId) }); 
    if (result.error) return window.alert(result.error)
    setModal(false); 
    setForm(blank) 
  }
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span><Form /></span> Pendaftaran Pasien
          </h1>
          <p className="text-muted">
            Daftarkan kunjungan pasien dan buat nomor antrean otomatis.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={14}/> Pendaftaran Baru
        </button>
      </div>

      <section className="card">
        <div className="card-header">
          <h2>Daftar Pendaftaran</h2>
          <span className="text-muted">{visits.length} kunjungan</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Antrean</th>
                <th>Pasien</th>
                <th>Dokter / Poli</th>
                <th>Tanggal</th>
                <th>Pembayaran</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...visits].reverse().map((visit) => (
                <tr key={visit.id}>
                  <td>
                    <strong className="font-mono">{visit.queueNumber}</strong>
                  </td>
                  <td>
                    <strong>{getPatient(visit.patientId)?.name || '-'}</strong>
                    <br />
                    <span className="small-text text-muted">{visit.complaint}</span>
                  </td>
                  <td>
                    {visit.doctor}
                    <br />
                    <span className="small-text text-muted">{visit.poli}</span>
                  </td>
                  <td>{visit.date}</td>
                  <td>{visit.payment}</td>
                  <td>
                    <Status value={visit.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <Modal title="Pendaftaran Pasien Baru" onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Pasien<span className="required">*</span>
                  </label>
                  <select
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    required
                  >
                    <option value="">Pilih pasien</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.mrn} — {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Dokter</label>
                  <select
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: Number(e.target.value) })}
                    required
                  >
                    <option value="">Pilih dokter</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Poli</label>
                  <select
                    value={form.poli}
                    onChange={(e) => setForm({ ...form, poli: e.target.value })}
                    required
                  >
                    <option value="">Pilih poli</option>
                    {referenceData.clinics.map((poli) => (
                      <option key={poli}>{poli}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Jenis Pembayaran</label>
                  <select
                    value={form.payment}
                    onChange={(e) => setForm({ ...form, payment: e.target.value })}
                    required
                  >
                    <option value="">Pilih pembayaran</option>
                    {referenceData.paymentTypes.map((payment) => <option key={payment}>{payment}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Keluhan Awal</label>
                  <textarea
                    value={form.complaint}
                    onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                    required
                  />
                </div>
              </div>

              <p className="auto-note">
                Nomor antrean akan dibuat otomatis ketika pendaftaran disimpan.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModal(false)}
              >
                Batal
              </button>
              <button className="btn btn-primary">Simpan Pendaftaran</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
