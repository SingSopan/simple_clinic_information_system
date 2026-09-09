const express = require('express')
const router = express.Router()

// GET /api/health
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Clinic API is up and running 🏥',
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
