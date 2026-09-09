import { create } from 'zustand'
import { nextQueueNumber, resetQueueCounter } from '../utils/generateMRN'

/**
 * Global queue store – manages queue list and current called number.
 */
const useQueueStore = create((set, get) => ({
  queueList: JSON.parse(localStorage.getItem('clinic_queue') || '[]'),
  calledNumber: null,

  /** Add a new patient to the queue */
  addToQueue: (patient) => {
    const number = nextQueueNumber()
    const entry = {
      id: Date.now(),
      number,
      patientName: patient.name,
      patientId: patient.id,
      poli: patient.poli || '-',
      status: 'waiting',
      createdAt: new Date().toISOString(),
    }
    const newList = [...get().queueList, entry]
    localStorage.setItem('clinic_queue', JSON.stringify(newList))
    set({ queueList: newList })
    return entry
  },

  /** Call the next waiting patient */
  callNext: () => {
    const waiting = get().queueList.filter((q) => q.status === 'waiting')
    if (waiting.length === 0) return null
    const next = waiting[0]
    get().updateStatus(next.id, 'checkin')
    set({ calledNumber: next.number })
    return next
  },

  /** Update the status of a queue entry */
  updateStatus: (id, status) => {
    const newList = get().queueList.map((q) =>
      q.id === id ? { ...q, status } : q
    )
    localStorage.setItem('clinic_queue', JSON.stringify(newList))
    set({ queueList: newList })
  },

  /** Reset today's queue */
  resetQueue: () => {
    resetQueueCounter()
    localStorage.removeItem('clinic_queue')
    set({ queueList: [], calledNumber: null })
  },

  /** Load queue from storage */
  loadQueue: () => {
    const stored = JSON.parse(localStorage.getItem('clinic_queue') || '[]')
    set({ queueList: stored })
  },
}))

export default useQueueStore
