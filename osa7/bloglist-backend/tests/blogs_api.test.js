const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testHelper = require('./test_helper')

const api = supertest(app)

const getToken = async (creds) => {
  const response = await api
    .post('/api/login')
    .send(creds)
    .expect(200)

  return response.body.token
}

let token

beforeAll(async () => {
  const user = await User.findOne({ username: testHelper.blogCredentials.username })
  if (!user) {
    const passwordHash = await bcrypt.hash(testHelper.blogCredentials.password, 10)
    const user = new User({ username: testHelper.blogCredentials.username, passwordHash })

    await user.save()
  }
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const user = await User.findOne({ username: testHelper.blogCredentials.username })
  const blogsToAdd = testHelper.initialBlogs.map(blog => ({ ...blog, user: user._id.toString() }))
  await Blog.insertMany(blogsToAdd)
})

describe('Get blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(testHelper.initialBlogs.length)
  })

  test('specific blog is returned', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)
    expect(contents).toContain('Go To Statement Considered Harmful')
  })

  test('blogs should have field id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => expect(blog.id).toBeDefined()
    )
  })
})

describe('Add blog', () => {

  beforeEach(async () => {
    token = await getToken(testHelper.blogCredentials)
  })

  test('new blog is added after POST operation', async () => {
    const user = await User.findOne({ username: testHelper.blogCredentials.username })

    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfterPost = await testHelper.blogsInDb()
    const addedBlog = blogsAfterPost[testHelper.initialBlogs.length]
    delete addedBlog.id

    expect(blogsAfterPost).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(addedBlog).toEqual(newBlog)

  })

  test('if likes is null, then it is set to 0', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: null
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfterPost = await testHelper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(blogsAfterPost[testHelper.initialBlogs.length].likes).toBe(0)

  })

  test('if likes is missing from request body, then it is set to 0', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: null
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfterPost = await testHelper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(blogsAfterPost[testHelper.initialBlogs.length].likes).toBe(0)
  })

  test('If title is missing from request body, then response code is 400', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('If title is null, then response code is 400', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      title: null,
      likes: 1
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('If title length is 0, then response code is 400', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      title: '',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('If url is missing from request body, then response code is 400', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      title: 'Go To Statement Considered Harmful',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('If url is null, then response code is 400', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      title: 'Go To Statement Considered Harmful',
      url: null,
      likes: 1
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('If url lenght is 0, then response code is 400', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      title: 'Go To Statement Considered Harmful',
      url: '',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('If token is missing from header, then 401 is returned', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('{"error":"token missing or invalid"}')
  })

  test('If token is empty, then 401 is returned', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .auth('', { type: 'bearer' })
      .send(newBlog)
      .expect(401)
      .expect('{"error":"token missing or invalid"}')
  })
})

describe('Delete blog', () => {

  beforeEach(async () => {
    token = await getToken(testHelper.blogCredentials)
  })

  test('when DELETE is called with valid id, blog is deleted', async () => {
    const blogsBeforeDelete = await testHelper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogsBeforeDelete[0].id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)

    const blogsAfterDelete = await testHelper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(blogsBeforeDelete.length - 1)
    expect(blogsAfterDelete).not.toContainEqual(blogsBeforeDelete[0])
  })

  test('when DELETE is called without id, 404 is returned', async () => {
    await api
      .delete('/api/blogs/')
      .auth(token, { type: 'bearer' })
      .expect(404)
  })

  test('when DELETE is called without token, 401 is returned', async () => {
    const blogsBeforeDelete = await testHelper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogsBeforeDelete[0].id}`)
      .expect(401)
      .expect('{"error":"token missing or invalid"}')
  })
})

describe('Update blog', () => {
  test('When PUT is called with valid id, blog is updated', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.likes = blogToUpdate.likes + 1

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const blogsAfterUpdate = await testHelper.blogsInDb()
    expect(blogsAfterUpdate).toContainEqual(blogToUpdate)

  })

  test('Title cannot be null in update', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.title = null

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400)
  })

  test('Title cannot be empty in update', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.title = ''

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400)
  })

  test('Url cannot be null in update', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.url = null

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400)
  })

  test('Url cannot be empty in update', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.url = ''

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400)
  })

  test('If likes is null, then it is set to 0', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.likes = null

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-type', /application\/json/)

    blogToUpdate.likes = 0

    const blogsAfterUpdate = await testHelper.blogsInDb()
    expect(blogsAfterUpdate).toContainEqual(blogToUpdate)
  })

  test('If endpoint is called with invalid id, 404 is returned', async () => {
    const blogsBeforeUpdate = await testHelper.blogsInDb()

    const blogToUpdate = blogsBeforeUpdate[0]
    blogToUpdate.id = await testHelper.nonExistingId()

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})