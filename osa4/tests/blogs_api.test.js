const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testHelper.initialBlogs)
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
  test('new blog is added after POST operation', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfterPost = await testHelper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(blogsAfterPost).toContainEqual(newBlog)

  })

  test('if likes is null, then it is set to 0', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: null
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfterPost = await testHelper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(blogsAfterPost[testHelper.initialBlogs.length].likes).toBe(0)

  })

  test('if likes is missing from request body, then it is set to 0', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: null
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfterPost = await testHelper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(blogsAfterPost[testHelper.initialBlogs.length].likes).toBe(0)
  })

  test('If title is missing from request body, then response code is 400', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('If title is null, then response code is 400', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      title: null,
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('If title length is 0, then response code is 400', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      title: '',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('If url is missing from request body, then response code is 400', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      author: 'Edsger W. Dijkstra',
      title: 'Go To Statement Considered Harmful',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('If url is null, then response code is 400', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      author: 'Edsger W. Dijkstra',
      title: 'Go To Statement Considered Harmful',
      url: null,
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('If url lenght is 0, then response code is 400', async () => {
    const newBlog = {
      id: await testHelper.nonExistingId(),
      author: 'Edsger W. Dijkstra',
      title: 'Go To Statement Considered Harmful',
      url: '',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('Delete blog', () => {
  test('when DELETE is called with valid id, blog is deleted', async () => {
    const blogsBeforeDelete = await testHelper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogsBeforeDelete[0].id}`)
      .expect(204)

    const blogsAfterDelete = await testHelper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(blogsBeforeDelete.length - 1)
    expect(blogsAfterDelete).not.toContainEqual(blogsBeforeDelete[0])
  })

  test('when DELETE is called without id, 404 is returned', async () => {
    await api
      .delete('/api/blogs/')
      .expect(404)
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