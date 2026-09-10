import { useState } from 'react'
import useClinicStore, { today } from '../../../store/clinicStore.js'
import { Status } from '../../dashboard/components/DashboardContent.jsx'
import { LogsIcon, Phone } from 'lucide-react'
import Pagination from '../../../components/Pagination/Pagination.jsx'

const PAGE_SIZE = 5
const nextStatus = { Menunggu: 'Check In', 'Check In': 'Pemeriksaan', Pemeriksaan: 'Selesai' }
export default function Queue() {
  const { queues, getPatient, callNext, updateVisitStatus } = useClinicStore(); 
  const [called, setCalled] = useState(null); 
  const [page, setPage] = useState(1)
  const queue = queues.filter((visit) => visit.date === today).sort((a, b) => a.queueNumber.localeCompare(b.queueNumber))
  const queueRows = queue.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const call = async () => { 
    const result = await callNext(); 
    if (result.error) return window.alert(result.error)
    if (result.visit) setCalled(result.visit) 
  }
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>
              <LogsIcon size={25} />
            </span>{' '}
            Antrean Pasien
          </h1>
          <p className="text-muted">Kelola panggilan dan status antrean kunjungan hari ini.</p>
        </div>
        <button
          className="btn btn-success"
          onClick={call}
          disabled={!queue.some((visit) => visit.status === 'Menunggu')}
        >
          <Phone size={14} /> Panggil Antrean Berikutnya
        </button>
      </div>

      <section className="queue-highlight">
        <div className="queue-number-display">
          <div className="queue-number-label">Sedang Dipanggil</div>
          <div className="queue-number-value">{called?.queueNumber || '—'}</div>
          <p>{called ? getPatient(called.patientId)?.name : 'Belum ada antrean dipanggil'}</p>
        </div>
        <div className="queue-summary">
          <div>
            <strong>{queue.length}</strong>
            <span>Total antrean</span>
          </div>
          <div>
            <strong>{queue.filter((visit) => visit.status === 'Menunggu').length}</strong>
            <span>Menunggu</span>
          </div>
          <div>
            <strong>{queue.filter((visit) => visit.status === 'Selesai').length}</strong>
            <span>Selesai</span>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Daftar Antrean</h2>
          <span className="text-muted">
            {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Pasien</th>
                <th>Poli</th>
                <th>Status</th>
                <th>Perbarui Status</th>
              </tr>
            </thead>
            <tbody>
              {queueRows.map((visit) => (
                <tr key={visit.id}>
                  <td>
                    <strong className="font-mono">{visit.queueNumber}</strong>
                  </td>
                  <td>{getPatient(visit.patientId)?.name}</td>
                  <td>{visit.poli}</td>
                  <td>
                    <Status value={visit.status} />
                  </td>
                  <td>
                    {nextStatus[visit.status] ? (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={async () => { const result = await updateVisitStatus(visit.id, nextStatus[visit.status]); if (result.error) window.alert(result.error) }}
                      >
                        {nextStatus[visit.status]}
                      </button>
                    ) : (
                      <span className="text-muted small-text">Selesai</span>
                    )}
                  </td>
                </tr>
              ))}
              {!queue.length && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Tidak ada antrean hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          total={queue.length}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </section>
    </>
  )
}
