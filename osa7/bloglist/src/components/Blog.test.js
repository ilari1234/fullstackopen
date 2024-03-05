import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('Renders blog content', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    user: {
      username: 'testUser1',
      name: 'Test User'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const element = screen.getByText(`${blog.title} ${blog.author}`)
  expect(element).toBeDefined()
  const blogSecondary = container.querySelector('#blogTogglable')
  expect(blogSecondary).toHaveStyle('display: none')
})

test('All information is shown after pressing View', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    user: {
      username: 'testUser1',
      name: 'Test User'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()

  const element = container.querySelector('#blogTogglable')
  expect(element).toHaveStyle('display: none')
  const button = screen.getByText('View')
  await user.click(button)
  const elementAfterClick = container.querySelector('#blogTogglable')
  expect(elementAfterClick).not.toHaveStyle('display: none')

  const likesElement = screen.getByText('Likes:')
  const urlElement = screen.getByText(`${blog.url}`)
  const userElement = screen.getByText(`${blog.user.name}`)
  expect(likesElement).toBeDefined()
  expect(urlElement).toBeDefined()
  expect(userElement).toBeDefined()
})

test('Pressing like calls eventhandler', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    user: {
      username: 'testUser1',
      name: 'Test User'
    }
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('Like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})

test('Function is called with right data when blog is created', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'http://www.testblog.com'
  }

  const user = userEvent.setup()
  const createBlog = jest.fn()
  const { container } = render(<BlogForm createBlog={createBlog} />)
  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const saveButton = screen.getByText('Add blog')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)
  await user.click(saveButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blog)

})