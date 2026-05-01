const jwt = require('jsonwebtoken')

function signToken(payload, secret, expiresIn='7d'){
  return jwt.sign(payload, secret, { expiresIn })
}

function verifyToken(token, secret){
  return jwt.verify(token, secret)
}

module.exports = { signToken, verifyToken }
