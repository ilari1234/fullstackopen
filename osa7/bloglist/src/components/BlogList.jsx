import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from '../reducers/blogReducer'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  if (!blogs) {
    return null
  }

  return (
    <div>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
    </div>
  )
}

export default BlogList
