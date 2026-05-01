require('dotenv').config()
const createApp = require('./app')
const connectDB = require('./config/db')

const DEFAULT_PORT = Number(process.env.PORT) || 5000

async function startServer(app, port){
  return new Promise((resolve, reject) => {
    const server = app.listen(port, ()=> {
      console.log(`Server running on port ${port}`)
      resolve(server)
    })
    server.on('error', (err) => {
      reject(err)
    })
  })
}

async function start(){
  try{
    await connectDB(process.env.MONGO_URI)
    const app = createApp()
    let port = DEFAULT_PORT
    const maxAttempts = 5
    for(let i=0;i<maxAttempts;i++){
      try{
        await startServer(app, port)
        return
      }catch(err){
        if(err && err.code === 'EADDRINUSE'){
          console.warn(`Port ${port} in use, trying ${port+1}`)
          port++
          continue
        }
        throw err
      }
    }
    console.error('Unable to bind to any port')
    process.exit(1)
  }catch(err){
    console.error('Failed to start', err)
    process.exit(1)
  }
}

start()
