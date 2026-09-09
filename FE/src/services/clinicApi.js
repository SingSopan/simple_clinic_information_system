import api from './api.js'
export const clinicApi = {
  referenceData: () => api.get('/reference-data'),

  users: {
    list: () => api.get('/users'),
    doctors: () => api.get('/doctors'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    remove: (id) => api.delete(`/users/${id}`)
  },

  patients: {
    list: (params) => api.get('/patients', { params }),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    remove: (id) => api.delete(`/patients/${id}`)
  },

  registrations: {
    list: () => api.get('/registrations'),
    create: (data) => api.post('/registrations', data),
    update: (id, data) => api.put(`/registrations/${id}`, data)
  },

  queues: {
    list: (params) => api.get('/queues', { params }),
    create: (data) => api.post('/queues', data),
    call: (id) => api.put(`/queues/${id}/call`),
    status: (id, status) => api.put(`/queues/${id}/status`, { status })
  },

  medicalRecords: {
    list: () => api.get('/medical-records'),
    create: (data) => api.post('/medical-records', data),
    byPatient: (id) => api.get(`/medical-records/${id}`)
  },

  prescriptions: {
    create: (data) => api.post('/prescriptions', data),
    get: (id) => api.get(`/prescriptions/${id}`)
  }
}
