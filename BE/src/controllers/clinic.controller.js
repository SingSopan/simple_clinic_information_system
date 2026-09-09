const db = require('../config/db')

const pad = (number) => String(number).padStart(3, '0')

const sendError = (res, error) => {
  const statusCode = Number.isInteger(error.code) ? error.code : 500
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error'
  })
}

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !body[field])
  if (missing.length) {
    const error = new Error(`Field wajib: ${missing.join(', ')}`)
    error.code = 400
    throw error
  }
}

// Nomor dihitung per tanggal. Saat tanggal berganti, MAX kembali 0 dan antrean dimulai dari A001.
const nextQueueNumber = async (client, date) => {
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [String(date)])
  const last = await client.query(
    'SELECT COALESCE(MAX(SUBSTRING(queue_number FROM 2)::INTEGER),0) AS number FROM queues WHERE queue_date=$1',
    [date]
  )
  return `A${pad(Number(last.rows[0].number) + 1)}`
}

const patientColumns =
  'id, medical_record_number AS "medicalRecordNumber", nik, name, gender, birth_date AS "birthDate", phone, address, created_at AS "createdAt", updated_at AS "updatedAt"'

exports.referenceData = (req, res) => {
  return res.json({
    success: true,
    data: {
      clinics: ['Poli Umum', 'Poli Gigi', 'Poli KIA'],
      paymentTypes: ['Umum', 'BPJS', 'Asuransi'],
      visitStatuses: ['Menunggu', 'Check In', 'Pemeriksaan', 'Selesai'],
      userRoles: ['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran']
    }
  })
}

// --- Patients ---
exports.listPatients = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query
    const offset = (Number(page) - 1) * Number(limit)
    const params = [`%${search}%`, Number(limit), offset]

    const [items, count] = await Promise.all([
      db.query(
        `SELECT ${patientColumns} FROM patients WHERE name ILIKE $1 OR nik ILIKE $1 OR medical_record_number ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
        params
      ),
      db.query(
        `SELECT COUNT(*) FROM patients WHERE name ILIKE $1 OR nik ILIKE $1 OR medical_record_number ILIKE $1`,
        [params[0]]
      )
    ])

    res.json({
      success: true,
      data: items.rows,
      meta: {
        total: Number(count.rows[0].count),
        page: Number(page),
        limit: Number(limit)
      }
    })
  } catch (error) {
    sendError(res, error)
  }
}

exports.getPatient = async (req, res) => {
  try {
    const result = await db.query(`SELECT ${patientColumns} FROM patients WHERE id=$1`, [req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    sendError(res, error)
  }
}

exports.createPatient = async (req, res) => {
  try {
    requireFields(req.body, ['nik', 'name', 'gender', 'birthDate', 'phone', 'address'])

    const sequence = await db.query("SELECT nextval('patients_id_seq') AS id")
    const id = sequence.rows[0].id
    const mrn = `RM-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(id).padStart(5, '0')}`
    const b = req.body

    const result = await db.query(
      'INSERT INTO patients (id,medical_record_number,nik,name,gender,birth_date,phone,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ' +
        patientColumns,
      [id, mrn, b.nik, b.name, b.gender, b.birthDate, b.phone, b.address]
    )

    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'NIK sudah terdaftar' })
    }
    sendError(res, error)
  }
}

exports.updatePatient = async (req, res) => {
  try {
    requireFields(req.body, ['nik', 'name', 'gender', 'birthDate', 'phone', 'address'])
    const b = req.body

    const result = await db.query(
      'UPDATE patients SET nik=$1,name=$2,gender=$3,birth_date=$4,phone=$5,address=$6,updated_at=NOW() WHERE id=$7 RETURNING ' +
        patientColumns,
      [b.nik, b.name, b.gender, b.birthDate, b.phone, b.address, req.params.id]
    )

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan' })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'NIK sudah terdaftar' })
    }
    sendError(res, error)
  }
}

exports.deletePatient = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM patients WHERE id=$1 RETURNING id', [req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan' })
    }
    res.status(204).send()
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Pasien sudah memiliki riwayat kunjungan dan tidak dapat dihapus'
      })
    }
    sendError(res, error)
  }
}

// --- Registrations ---
const registrationsQuery = `SELECT r.id, r.patient_id AS "patientId", p.name AS "patientName", p.medical_record_number AS "medicalRecordNumber", r.doctor_id AS "doctorId", u.name AS doctor, r.clinic, TO_CHAR(r.visit_date,'YYYY-MM-DD') AS date, r.payment_type AS payment, r.initial_complaint AS complaint, r.status, q.id AS "queueId", q.queue_number AS "queueNumber" FROM registrations r JOIN patients p ON p.id=r.patient_id JOIN users u ON u.id=r.doctor_id AND u.role='Dokter' LEFT JOIN queues q ON q.registration_id=r.id`

exports.listRegistrations = async (req, res) => {
  try {
    const result = await db.query(`${registrationsQuery} ORDER BY r.visit_date DESC, r.id DESC`)
    res.json({ success: true, data: result.rows })
  } catch (error) {
    sendError(res, error)
  }
}

exports.createRegistration = async (req, res) => {
  const client = await db.connect()
  try {
    const b = req.body
    requireFields(b, ['patientId', 'doctorId', 'clinic', 'date', 'payment', 'complaint'])

    await client.query('BEGIN')

    const doctor = await client.query(
      "SELECT id FROM users WHERE id=$1 AND role='Dokter' AND is_active=TRUE",
      [b.doctorId]
    )
    if (!doctor.rowCount) {
      const error = new Error('Dokter tidak ditemukan atau tidak aktif')
      error.code = 400
      throw error
    }

    const inserted = await client.query(
      'INSERT INTO registrations (patient_id,doctor_id,clinic,visit_date,payment_type,initial_complaint) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [b.patientId, b.doctorId, b.clinic, b.date, b.payment, b.complaint]
    )

    const queueNumber = await nextQueueNumber(client, b.date)

    await client.query(
      'INSERT INTO queues (registration_id,queue_number,queue_date) VALUES ($1,$2,$3)',
      [inserted.rows[0].id, queueNumber, b.date]
    )

    await client.query('COMMIT')

    const result = await db.query(`${registrationsQuery} WHERE r.id=$1`, [inserted.rows[0].id])
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    sendError(res, error)
  } finally {
    client.release()
  }
}

exports.updateRegistration = async (req, res) => {
  try {
    const b = req.body
    requireFields(b, ['patientId', 'doctorId', 'clinic', 'date', 'payment', 'complaint'])

    const doctor = await db.query(
      "SELECT id FROM users WHERE id=$1 AND role='Dokter' AND is_active=TRUE",
      [b.doctorId]
    )
    if (!doctor.rowCount) {
      return res.status(400).json({ success: false, message: 'Dokter tidak ditemukan atau tidak aktif' })
    }

    const result = await db.query(
      'UPDATE registrations SET patient_id=$1,doctor_id=$2,doctor_name=NULL,clinic=$3,visit_date=$4,payment_type=$5,initial_complaint=$6 WHERE id=$7 RETURNING id',
      [b.patientId, b.doctorId, b.clinic, b.date, b.payment, b.complaint, req.params.id]
    )
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Pendaftaran tidak ditemukan' })
    }

    await db.query('UPDATE queues SET queue_date=$1 WHERE registration_id=$2', [b.date, req.params.id])

    const item = await db.query(`${registrationsQuery} WHERE r.id=$1`, [req.params.id])
    res.json({ success: true, data: item.rows[0] })
  } catch (error) {
    sendError(res, error)
  }
}

// --- Queues ---
exports.listQueues = async (req, res) => {
  try {
    const where = req.query.date ? ' WHERE r.visit_date=$1' : ''
    const result = await db.query(`${registrationsQuery}${where} ORDER BY r.visit_date DESC, q.queue_number ASC`, req.query.date ? [req.query.date] : [])
    res.json({ success: true, data: result.rows.filter((row) => row.queueId) })
  } catch (error) {
    sendError(res, error)
  }
}

exports.createQueue = async (req, res) => {
  const client = await db.connect()
  try {
    requireFields(req.body, ['registrationId'])
    await client.query('BEGIN')
    const registration = await client.query('SELECT visit_date FROM registrations WHERE id=$1', [req.body.registrationId])
    if (!registration.rowCount) {
      await client.query('ROLLBACK')
      return res.status(404).json({ success: false, message: 'Pendaftaran tidak ditemukan' })
    }

    const date = registration.rows[0].visit_date
    const queueNumber = await nextQueueNumber(client, date)
    const result = await client.query(
      'INSERT INTO queues (registration_id,queue_number,queue_date) VALUES ($1,$2,$3) RETURNING *',
      [req.body.registrationId, queueNumber, date]
    )
    await client.query('COMMIT')
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Antrean untuk pendaftaran ini sudah ada' })
    }
    sendError(res, error)
  } finally { client.release() }
}

exports.callQueue = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE queues SET status='Check In',called_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id]
    )
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Antrean tidak ditemukan' })
    }

    await db.query("UPDATE registrations SET status='Check In' WHERE id=$1", [result.rows[0].registration_id])
    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    sendError(res, error)
  }
}

exports.updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['Menunggu', 'Check In', 'Pemeriksaan', 'Selesai'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status antrean tidak valid' })
    }

    const result = await db.query('UPDATE queues SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Antrean tidak ditemukan' })
    }

    await db.query('UPDATE registrations SET status=$1 WHERE id=$2', [status, result.rows[0].registration_id])
    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    sendError(res, error)
  }
}

// --- Medical Records ---
const medicalRecordsQuery = `SELECT mr.id, mr.registration_id, mr.patient_id,
  pat.name AS "patientName", pat.medical_record_number AS "medicalRecordNumber",
  mr.subjective, mr.blood_pressure, mr.temperature, mr.weight, mr.height,
  mr.assessment, mr.plan, mr.medical_action, mr.created_at, u.name AS doctor,
  COALESCE(STRING_AGG(p.medicine_details, E'\n' ORDER BY p.id), '') AS prescriptions
  FROM medical_records mr
  JOIN patients pat ON pat.id=mr.patient_id
  LEFT JOIN users u ON u.id=mr.doctor_id
  LEFT JOIN prescriptions p ON p.medical_record_id=mr.id`

exports.listMedicalRecords = async (req, res) => {
  try {
    const result = await db.query(`${medicalRecordsQuery} GROUP BY mr.id,pat.id,u.name ORDER BY mr.created_at DESC`)
    res.json({ success: true, data: result.rows })
  } catch (error) {
    sendError(res, error)
  }
}

exports.createMedicalRecord = async (req, res) => {
  try {
    const b = req.body
    requireFields(b, ['registrationId', 'patientId', 'subjective', 'assessment', 'plan'])

    const result = await db.query(
      `INSERT INTO medical_records (registration_id,patient_id,doctor_id,subjective,blood_pressure,temperature,weight,height,assessment,plan,medical_action)
       SELECT r.id,r.patient_id,r.doctor_id,$3,$4,$5,$6,$7,$8,$9,$10
       FROM registrations r WHERE r.id=$1 AND r.patient_id=$2 RETURNING *`,
      [
        b.registrationId,
        b.patientId,
        b.subjective,
        b.bloodPressure || null,
        b.temperature || null,
        b.weight || null,
        b.height || null,
        b.assessment,
        b.plan,
        b.actions || null
      ]
    )

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Pendaftaran pasien tidak ditemukan' })

    await db.query("UPDATE registrations SET status='Selesai' WHERE id=$1", [b.registrationId])
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Pemeriksaan untuk pendaftaran ini sudah ada' })
    }
    sendError(res, error)
  }
}

exports.getMedicalRecords = async (req, res) => {
  try {
    const result = await db.query(
      `${medicalRecordsQuery} WHERE mr.patient_id=$1 GROUP BY mr.id,pat.id,u.name ORDER BY mr.created_at DESC`,
      [req.params.patientId]
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    sendError(res, error)
  }
}

// --- Prescriptions ---
exports.createPrescription = async (req, res) => {
  try {
    requireFields(req.body, ['medicalRecordId', 'medicineDetails'])

    const result = await db.query(
      'INSERT INTO prescriptions (medical_record_id,medicine_details,notes) VALUES ($1,$2,$3) RETURNING *',
      [req.body.medicalRecordId, req.body.medicineDetails, req.body.notes || null]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    sendError(res, error)
  }
}

exports.getPrescription = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM prescriptions WHERE id=$1', [req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan' })
    }
    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    sendError(res, error)
  }
}
