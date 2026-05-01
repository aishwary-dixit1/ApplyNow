const mongoose = require('mongoose')

async function connectDB(uri){
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

module.exports = connectDB
