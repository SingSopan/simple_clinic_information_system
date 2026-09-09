const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const healthRoutes = require('./routes/health.routes')

const app = express()

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:3000',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ──────────────────────────────────────────────────
app.use('/api/health', healthRoutes)
app.use('/api', authRoutes)
app.use('/api/auth', authRoutes)
app.use('/api', require('./routes/clinic.routes'))
// Alias tanpa prefix API agar endpoint sesuai spesifikasi dapat digunakan langsung.
app.use('/', authRoutes)
app.use('/', require('./routes/clinic.routes'))

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

module.exports = app
