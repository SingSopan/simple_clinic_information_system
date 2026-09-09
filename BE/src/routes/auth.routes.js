const router = require('express').Router()
const auth = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/auth.middleware')
router.post('/login', auth.login); router.post('/logout', authenticate, auth.logout); router.get('/me', authenticate, auth.me)
module.exports = router
