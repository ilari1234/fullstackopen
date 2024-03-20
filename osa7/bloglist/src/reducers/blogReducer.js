import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const sortBlogs = blogs => {
  return blogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return -1
    }
  })
}

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
      return sortBlogs(
        state.map(blog =>
          blog.id === action.payload.id ? action.payload : blog,
        ),
      )
    },
    removeBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload.id)
    },
  },
})

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions

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

export const likeBlog = blogObject => {
  return async dispatch => {
    const updatedBlog = await blogService.updateBlog(blogObject.id, {
      ...blogObject,
      likes: blogObject.likes + 1,
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = blogObject => {
  return async dispatch => {
    await blogService.deleteBlog(blogObject.id)
    dispatch(removeBlog(blogObject))
  }
}

export default blogSlice.reducer
