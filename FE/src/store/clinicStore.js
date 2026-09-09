import { create } from 'zustand'
import { clinicApi } from '../services/clinicApi.js'

const currentDate = new Date()
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
const patientFromApi = (patient) => ({ ...patient, mrn: patient.medicalRecordNumber })
const visitFromApi = (visit) => ({ ...visit, date: String(visit.date).slice(0, 10), poli: visit.clinic })
const medicalRecordFromApi = (record) => ({ ...record, patientId: record.patient_id, visitId: record.registration_id, patientName: record.patientName, medicalRecordNumber: record.medicalRecordNumber, bloodPressure: record.blood_pressure, actions: record.medical_action, prescriptions: record.prescriptions, createdAt: record.created_at })
const apiMessage = (error) => error.response?.data?.message || 'Gagal menghubungi backend.'

const useClinicStore = create((set, get) => ({
  patients: [],
  visits: [],
  queues: [],
  doctors: [],
  referenceData: { clinics: [], paymentTypes: [], visitStatuses: [], userRoles: [] },
  examinations: [],
  loading: false,
  error: null,
  hydrate: async () => {
    set({ loading: true, error: null })
    try {
      const [patientsResponse, registrationsResponse, queuesResponse, doctorsResponse, referenceResponse] = await Promise.all([clinicApi.patients.list({ limit: 100 }), clinicApi.registrations.list(), clinicApi.queues.list({ date: today }), clinicApi.users.doctors(), clinicApi.referenceData()])
      const role = localStorage.getItem('role')
      const canViewMedicalRecords = ['Superadmin', 'Administrator', 'Dokter'].includes(role)
      const medicalRecordsResponse = canViewMedicalRecords ? await clinicApi.medicalRecords.list() : null
      set({ patients: patientsResponse.data.data.map(patientFromApi), visits: registrationsResponse.data.data.map(visitFromApi), queues: queuesResponse.data.data.map(visitFromApi), doctors: doctorsResponse.data.data, referenceData: referenceResponse.data.data, examinations: medicalRecordsResponse ? medicalRecordsResponse.data.data.map(medicalRecordFromApi) : [], loading: false })
    } catch (error) { set({ patients: [], visits: [], queues: [], doctors: [], referenceData: { clinics: [], paymentTypes: [], visitStatuses: [], userRoles: [] }, loading: false, error: apiMessage(error) }) }
  },
  addPatient: async (data) => {
    try { const response = await clinicApi.patients.create(data); const patient = patientFromApi(response.data.data); set({ patients: [...get().patients, patient] }); return { patient } } catch (error) { return { error: apiMessage(error) } }
  },
  updatePatient: async (id, data) => {
    try { const response = await clinicApi.patients.update(id, data); const patient = patientFromApi(response.data.data); set({ patients: get().patients.map((item) => item.id === id ? patient : item) }); return { patient } } catch (error) { return { error: apiMessage(error) } }
  },
  removePatient: async (id) => {
    try { await clinicApi.patients.remove(id); set({ patients: get().patients.filter((item) => item.id !== id) }); return {} } catch (error) { return { error: apiMessage(error) } }
  },
  addVisit: async (data) => {
    try { const response = await clinicApi.registrations.create({ ...data, clinic: data.poli }); const visit = visitFromApi(response.data.data); await get().hydrate(); return { visit } } catch (error) { return { error: apiMessage(error) } }
  },
  updateVisitStatus: async (id, status) => {
    const visit = get().queues.find((item) => item.id === id)
    if (!visit?.queueId) return { error: 'Antrean untuk pendaftaran ini tidak ditemukan.' }
    try { await clinicApi.queues.status(visit.queueId, status); await get().hydrate(); return {} } catch (error) { return { error: apiMessage(error) } }
  },
  callNext: async () => {
    const next = get().queues.find((visit) => visit.date === today && visit.status === 'Menunggu')
    if (!next) return { error: 'Tidak ada antrean yang menunggu.' }
    try { await clinicApi.queues.call(next.queueId); await get().hydrate(); return { visit: { ...next, status: 'Check In' } } } catch (error) { return { error: apiMessage(error) } }
  },
  saveExamination: async (data) => {
    try {
      const recordResponse = await clinicApi.medicalRecords.create({ ...data, registrationId: data.visitId })
      const record = recordResponse.data.data
      if (data.prescriptions) await clinicApi.prescriptions.create({ medicalRecordId: record.id, medicineDetails: data.prescriptions })
      const examination = { ...data, id: record.id, createdAt: record.created_at || new Date().toISOString() }
      set({ examinations: [examination, ...get().examinations], visits: get().visits.map((item) => item.id === data.visitId ? { ...item, status: 'Selesai' } : item) })
      return { examination }
    } catch (error) { return { error: apiMessage(error) }
    }
  },
  loadPatientHistory: async (patientId) => {
    try { const response = await clinicApi.medicalRecords.byPatient(patientId); const examinations = response.data.data.map(medicalRecordFromApi); set({ examinations }); return { examinations } } catch (error) { return { error: apiMessage(error) } }
  },
  getPatient: (id) => get().patients.find((patient) => String(patient.id) === String(id)),
}))

export { today }
export default useClinicStore
