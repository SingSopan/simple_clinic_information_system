const router = require('express').Router(); const controller = require('../controllers/clinic.controller'); const { authenticate, authorize } = require('../middleware/auth.middleware')
router.use(authenticate)
const staff = ['Superadmin', 'Administrator', 'Petugas Pendaftaran']; const clinical = ['Superadmin', 'Administrator', 'Dokter']; const everyone = ['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran']
const users = require('../controllers/user.controller')
router.get('/doctors', authorize(...everyone), users.doctors)
router.get('/reference-data', authorize(...everyone), controller.referenceData)
router.get('/users', authorize('Superadmin'), users.list); router.post('/users', authorize('Superadmin'), users.create); router.put('/users/:id', authorize('Superadmin'), users.update); router.delete('/users/:id', authorize('Superadmin'), users.remove)
router.get('/patients', authorize(...everyone), controller.listPatients); router.get('/patients/:id', authorize(...everyone), controller.getPatient); router.post('/patients', authorize(...staff), controller.createPatient); router.put('/patients/:id', authorize(...staff), controller.updatePatient); router.delete('/patients/:id', authorize(...staff), controller.deletePatient)
router.get('/registrations', authorize(...everyone), controller.listRegistrations); router.post('/registrations', authorize(...staff), controller.createRegistration); router.put('/registrations/:id', authorize(...staff), controller.updateRegistration)
router.get('/queues', authorize(...everyone), controller.listQueues); router.post('/queues', authorize(...staff), controller.createQueue); router.put('/queues/:id/call', authorize(...staff), controller.callQueue); router.put('/queues/:id/status', authorize(...everyone), controller.updateQueueStatus)
router.get('/medical-records', authorize(...clinical), controller.listMedicalRecords); router.post('/medical-records', authorize(...clinical), controller.createMedicalRecord); router.get('/medical-records/:patientId', authorize(...clinical), controller.getMedicalRecords)
router.post('/prescriptions', authorize(...clinical), controller.createPrescription); router.get('/prescriptions/:id', authorize(...clinical), controller.getPrescription)
module.exports = router
