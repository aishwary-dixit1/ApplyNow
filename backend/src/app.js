const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')
const errorHandler = require('./middleware/errorHandler')
const passportInit = require('./services/passport')
const passport = require('passport')

function createApp(){
  const app = express()
  app.use(helmet())
  app.use(express.json())
  app.use(cookieParser())
  app.use(morgan('dev'))

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))

  // basic request sanitization
  const sanitize = require('./middleware/sanitize')
  app.use(sanitize)

  app.use(rateLimit({ windowMs: 1*60*1000, max: 120 }))

  passportInit()
  app.use(passport.initialize())

  // mount routes
  app.use('/api/auth', authRoutes)
  app.use('/api/jobs', jobRoutes)

  app.use(errorHandler)
  return app
}

module.exports = createApp
