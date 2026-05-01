const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const createApp = require('../app')
const User = require('../models/User')
const Job = require('../models/Job')
const { signToken } = require('../utils/jwt')

let mongod
let app
let authCookie
let userId

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret'
  process.env.CLIENT_URL = 'http://localhost:5173'
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
  app = createApp()

  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    provider: 'google'
  })
  userId = user._id.toString()
  const token = signToken({ id: userId, email: user.email, name: user.name }, process.env.JWT_SECRET)
  authCookie = `token=${token}`
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if(mongod) await mongod.stop()
})

afterEach(async () => {
  await Job.deleteMany({})
})

describe('Job APIs', () => {
  test('creates and lists jobs', async () => {
    const createRes = await request(app)
      .post('/api/jobs')
      .set('Cookie', authCookie)
      .send({ companyName: 'Acme', role: 'Frontend Engineer', status: 'Applied' })

    expect(createRes.status).toBe(201)
    expect(createRes.body.job.companyName).toBe('Acme')

    const listRes = await request(app).get('/api/jobs').set('Cookie', authCookie)
    expect(listRes.status).toBe(200)
    expect(Array.isArray(listRes.body.jobs)).toBe(true)
    expect(listRes.body.jobs.length).toBe(1)
  })

  test('updates favorite/archive and analytics', async () => {
    const job = await Job.create({ userId, companyName: 'Beta', role: 'Backend Engineer', status: 'Interviewing' })

    const favRes = await request(app)
      .patch(`/api/jobs/${job._id}/favorite`)
      .set('Cookie', authCookie)
      .send({ favorite: true })
    expect(favRes.status).toBe(200)
    expect(favRes.body.job.favorite).toBe(true)

    const archiveRes = await request(app)
      .patch(`/api/jobs/${job._id}/archive`)
      .set('Cookie', authCookie)
      .send({ archived: true })
    expect(archiveRes.status).toBe(200)
    expect(archiveRes.body.job.archived).toBe(true)

    const analyticsRes = await request(app).get('/api/jobs/analytics').set('Cookie', authCookie)
    expect(analyticsRes.status).toBe(200)
    expect(typeof analyticsRes.body.total).toBe('number')
    expect(Array.isArray(analyticsRes.body.byStatus)).toBe(true)
  })
})
