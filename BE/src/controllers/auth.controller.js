const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const revokedTokens = new Set()
const jwtSecret = () => process.env.JWT_SECRET || 'development-only-change-this-jwt-secret-key-2026'
exports.isRevoked = (token) => revokedTokens.has(token)
exports.login = async (req, res) => { const { email, password } = req.body; 
if (!email || !password) 
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' }); 
    try { 
        const result = await db.query('SELECT id,name,email,password_hash,role FROM users WHERE email=$1 AND is_active=TRUE', [email.toLowerCase()]); 
        const user = result.rows[0]; 
        if (!user || !await bcrypt.compare(password, user.password_hash)) 
        return res.status(401).json({ success: false, message: 'Email atau password tidak sesuai' }); 
        const payload = { id: user.id, name: user.name, email: user.email, role: user.role }; 
        const token = jwt.sign(payload, jwtSecret(), { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }); 
        res.json({ success: true, token, user: payload }) 
    } catch { res.status(500).json({ success: false, message: 'Server error' }) } 
}
exports.logout = (req, res) => { revokedTokens.add(req.token); 
    res.json({ success: true, message: 'Logout berhasil' }) 
}
exports.me = (req, res) => res.json({ success: true, user: req.user })
