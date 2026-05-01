const express = require('express')
const router = express.Router()
const passport = require('passport')
const { googleAuth, googleCallback, logout, getMe } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/google', googleAuth)
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback)
router.post('/logout', logout)
router.get('/me', authMiddleware, getMe)

module.exports = router
