const jwt = require('jsonwebtoken')
const { isRevoked } = require('../controllers/auth.controller')
const secret = () => process.env.JWT_SECRET || 'development-only-change-this-jwt-secret-key-2026'
const authenticate = (req, res, next) => { 
    const header = req.headers.authorization; 
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Token tidak tersedia' }); 
    const token = header.slice(7); 
    try { 
        if (isRevoked(token)) return res.status(401).json({ success: false, message: 'Token sudah logout' }); 
        req.user = jwt.verify(token, secret()); 
        req.token = token; 
        next() 
    } catch {
        return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa' }) 
    } 
}
const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses ke resource ini' })
    next()
}
module.exports = { authenticate, authorize }
