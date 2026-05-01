const { verifyToken } = require('../utils/jwt')

function authMiddleware(req, res, next){
  try{
    const token = req.cookies?.token
    if(!token) return res.status(401).json({ message: 'Unauthorized' })
    const payload = verifyToken(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  }catch(err){
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
