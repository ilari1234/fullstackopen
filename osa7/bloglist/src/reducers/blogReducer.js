import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      return action.payload
    },
    addBlog: (state, action) => {
      return [...state, action.payload]
    },
    updateBlog: (state, action) => {
      return state.map(blog =>
        blog.id === action.payload.id ? action.payload : blog,
      )
    },
    removeBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload.id)
    },
  },
})

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions

const sortBlogs = blogs => {
  return blogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return -1
    }
  })
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(sortBlogs(blogs)))
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    const addedBlog = await blogService.addBlog(blogObject)
    dispatch(addBlog(addedBlog))
  }
}

export default blogSlice.reducer
