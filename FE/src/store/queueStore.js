import { create } from 'zustand'
import { clinicApi } from '../services/clinicApi.js'

const useQueueStore = create((set, get) => ({
  queueList: [],
  calledNumber: null,
  loadQueue: async () => {
    const response = await clinicApi.queues.list()
    set({ queueList: response.data.data })
  },
  addToQueue: async (registrationId) => {
    const response = await clinicApi.queues.create({ registrationId })
    await get().loadQueue()
    return response.data.data
  },
  callNext: async () => {
    const next = get().queueList.find((queue) => queue.status === 'Menunggu')
    if (!next) return null
    await clinicApi.queues.call(next.queueId || next.id)
    set({ calledNumber: next.queueNumber })
    await get().loadQueue()
    return next
  },
  updateStatus: async (id, status) => { await clinicApi.queues.status(id, status); await get().loadQueue() },
}))

export default useQueueStore
