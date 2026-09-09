const jwt = require('jsonwebtoken')
const db = require('../config/db')

/**
 * POST /api/auth/login
 * Body: { username, password }
 *
 * NOTE: Replace this stub with real DB lookup + bcrypt.compare()
 *       once your `users` table is created.
 */
const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' })
  }

  try {
    // TODO: Query users table and verify password with bcrypt
    // const result = await db.query('SELECT * FROM users WHERE username = $1', [username])
    // const user = result.rows[0]
    // if (!user || !await bcrypt.compare(password, user.password)) { ... }

    // --- Temporary stub (replace after DB setup) ---
    if (username === 'admin' && password === 'admin123') {
      const payload = { id: 1, username: 'admin', role: 'admin' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      })
      return res.json({ success: true, token, user: payload })
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (from JWT).
 */
const me = (req, res) => {
  res.json({ success: true, user: req.user })
}

module.exports = { login, me }
