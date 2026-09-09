import { create } from 'zustand'
import { generateMRN, generateQueueNumber } from '../utils/generateMRN.js'

const today = new Date().toISOString().slice(0, 10)
const seedPatients = [
  { id: 1, mrn: 'RM-202609-00001', nik: '3273014501900001', name: 'Siti Aminah', gender: 'Perempuan', birthDate: '1990-01-15', phone: '081234567890', address: 'Jl. Melati No. 12' },
  { id: 2, mrn: 'RM-202609-00002', nik: '3273011202850002', name: 'Budi Santoso', gender: 'Laki-laki', birthDate: '1985-02-12', phone: '081298765432', address: 'Jl. Anggrek No. 8' },
  { id: 3, mrn: 'RM-202609-00003', nik: '3273015203920003', name: 'Rina Wulandari', gender: 'Perempuan', birthDate: '1992-03-22', phone: '085612345678', address: 'Jl. Kenanga No. 4' },
]
const seedVisits = [
  { id: 101, patientId: 1, doctor: 'dr. Andi Pratama', poli: 'Poli Umum', date: today, payment: 'BPJS', complaint: 'Demam dan batuk sejak 2 hari', status: 'Menunggu', queueNumber: 'A001' },
  { id: 102, patientId: 2, doctor: 'dr. Andi Pratama', poli: 'Poli Umum', date: today, payment: 'Umum', complaint: 'Kontrol tekanan darah', status: 'Check In', queueNumber: 'A002' },
]
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const useClinicStore = create((set, get) => ({
  patients: read('clinic_patients', seedPatients),
  visits: read('clinic_visits', seedVisits),
  examinations: read('clinic_examinations', []),
  addPatient: (data) => {
    if (get().patients.some((patient) => patient.nik === data.nik)) return { error: 'NIK sudah terdaftar.' }
    let mrn = generateMRN()
    while (get().patients.some((patient) => patient.mrn === mrn)) mrn = generateMRN()
    const patient = { ...data, id: Date.now(), mrn }
    const patients = [...get().patients, patient]; save('clinic_patients', patients); set({ patients }); return { patient }
  },
  updatePatient: (id, data) => {
    if (get().patients.some((patient) => patient.nik === data.nik && patient.id !== id)) return { error: 'NIK sudah terdaftar.' }
    const patients = get().patients.map((patient) => patient.id === id ? { ...patient, ...data } : patient); save('clinic_patients', patients); set({ patients }); return {}
  },
  removePatient: (id) => { const patients = get().patients.filter((patient) => patient.id !== id); save('clinic_patients', patients); set({ patients }) },
  addVisit: (data) => {
    const lastNumber = get().visits.filter((visit) => visit.date === data.date).reduce((max, visit) => Math.max(max, Number(visit.queueNumber?.slice(1)) || 0), 0)
    const visit = { ...data, id: Date.now(), queueNumber: generateQueueNumber(lastNumber + 1), status: 'Menunggu' }
    const visits = [...get().visits, visit]; save('clinic_visits', visits); set({ visits }); return visit
  },
  updateVisitStatus: (id, status) => { const visits = get().visits.map((visit) => visit.id === id ? { ...visit, status } : visit); save('clinic_visits', visits); set({ visits }) },
  callNext: () => { const next = get().visits.find((visit) => visit.date === today && visit.status === 'Menunggu'); if (!next) return null; get().updateVisitStatus(next.id, 'Check In'); return next },
  saveExamination: (data) => { const examination = { ...data, id: Date.now(), createdAt: new Date().toISOString() }; const examinations = [...get().examinations, examination]; save('clinic_examinations', examinations); get().updateVisitStatus(data.visitId, 'Selesai'); set({ examinations }) },
  getPatient: (id) => get().patients.find((patient) => String(patient.id) === String(id)),
}))

export { today }
export default useClinicStore
