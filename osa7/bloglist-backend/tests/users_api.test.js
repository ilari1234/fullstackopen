const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const testHelper = require('./test_helper')

const api = supertest(app)

describe('Add user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Creating user succeeds with a non existing username', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'testUser1',
      name: 'Test User',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Username must be unique', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'root',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('username is required', async () => {

  })

  test('username must be atleast 3 characters', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'root',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('{"error":"User validation failed: username: Username must have atleast 3 characters"}')

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('password must be atleast 3 characters', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'newUser',
      name: 'root',
      password: 'se',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('{"error":"password must have atleast 3 characters"}')

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })
})