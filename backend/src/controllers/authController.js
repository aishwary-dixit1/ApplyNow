const passport = require('passport')
const User = require('../models/User')
const { signToken } = require('../utils/jwt')

exports.googleAuth = (req, res, next) => {
  if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    return res.status(503).json({ message: 'Google OAuth is not configured' })
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
}

exports.googleCallback = async (req, res) => {
  // passport will attach profile on req.user
  try{
    const profile = req.user
    // find or create user
    let user = await User.findOne({ email: profile.emails[0].value })
    if(!user){
      user = await User.create({
        name: profile.displayName || profile.name?.givenName,
        email: profile.emails[0].value,
        avatar: profile.photos?.[0]?.value,
        googleId: profile.id,
        provider: 'google'
      })
    }

    const token = signToken({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET)
    const isProd = process.env.NODE_ENV === 'production'
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173')
  }catch(err){
    console.error(err)
    res.status(500).json({ message: 'Auth error' })
  }
}

exports.logout = (req, res)=>{
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}

exports.getMe = async (req, res)=>{
  try{
    const userId = req.user?.id
    if(!userId) return res.status(401).json({ message: 'Unauthorized' })
    const user = await User.findById(userId).select('-__v')
    res.json({ user })
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
}
