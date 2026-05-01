const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

module.exports = function(){
  if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    return
  }

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`
  }, (accessToken, refreshToken, profile, done) => {
    // pass profile forward; controller will handle user persistence
    return done(null, profile)
  }))
}
