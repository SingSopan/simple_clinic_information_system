const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinic_db',
  max: 10,              // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection on startup
pool.connect()
  .then((client) => {
    console.log('✅ PostgreSQL connected successfully')
    client.release()
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message)
  })

module.exports = pool
