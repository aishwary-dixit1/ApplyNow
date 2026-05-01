const express = require('express')
const fs = require('fs')
const path = require('path')
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
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://lh3.googleusercontent.com', 'https://*.googleusercontent.com']
      }
    }
  }))
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

  // In production, serve the built frontend from the same service.
  const frontendDistPath = path.resolve(__dirname, '../../frontend/dist')
  if(fs.existsSync(frontendDistPath)){
    app.use(express.static(frontendDistPath))
    app.get('*', (req, res, next) => {
      if(req.path.startsWith('/api/')) return next()
      return res.sendFile(path.join(frontendDistPath, 'index.html'))
    })
  }

  app.use(errorHandler)
  return app
}

module.exports = createApp
