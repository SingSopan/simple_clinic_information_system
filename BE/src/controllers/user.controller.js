const bcrypt = require('bcryptjs')
const db = require('../config/db')

const allowedRoles = ['Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran']
const columns = 'id,name,email,role,is_active AS "isActive",created_at AS "createdAt",updated_at AS "updatedAt"'

const failure = (res, error) => {
  if (error.code === '23505') {
    return res.status(409).json({ success: false, message: 'Email sudah digunakan' })
  }
  return res.status(500).json({ success: false, message: error.message || 'Internal server error' })
}

exports.list = async (req, res) => {
  try {
    const result = await db.query(`SELECT ${columns} FROM users ORDER BY name`)
    res.json({ success: true, data: result.rows })
  } catch (error) {
    failure(res, error)
  }
}

exports.doctors = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id,name,email FROM users WHERE role='Dokter' AND is_active=TRUE ORDER BY name`
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    failure(res, error)
  }
}

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Nama, email, password, dan role wajib diisi' })
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid' })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password minimal 8 karakter' })
    }

    const hash = await bcrypt.hash(password, 10)
    const result = await db.query(
      `INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING ${columns}`,
      [name, email.toLowerCase(), hash, role]
    )

    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    failure(res, error)
  }
}

exports.update = async (req, res) => {
  try {
    const { name, email, password, role, isActive = true } = req.body

    if (!name || !email || !role || !allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan role valid wajib diisi' })
    }

    if (String(req.params.id) === String(req.user.id) && (!isActive || role !== 'Superadmin')) {
      return res.status(400).json({
        success: false,
        message: 'Superadmin tidak dapat menonaktifkan atau menurunkan role akun sendiri'
      })
    }

    const hash = password ? await bcrypt.hash(password, 10) : null
    const result = await db.query(
      `UPDATE users SET name=$1,email=$2,role=$3,is_active=$4,password_hash=COALESCE($5,password_hash),updated_at=NOW() WHERE id=$6 RETURNING ${columns}`,
      [name, email.toLowerCase(), role, Boolean(isActive), hash, req.params.id]
    )

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' })
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    failure(res, error)
  }
}

exports.remove = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Superadmin tidak dapat menghapus akun sendiri'
      })
    }

    const result = await db.query('DELETE FROM users WHERE id=$1 RETURNING id', [req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' })
    }

    res.status(204).send()
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'User terkait dengan data klinik; nonaktifkan akun sebagai gantinya'
      })
    }
    failure(res, error)
  }
}
