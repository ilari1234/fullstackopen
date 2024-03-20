import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification, showErrorMessage } from './notificationReducer'

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

export const createBlog = (blogObject, userObject) => {
  return async dispatch => {
    try {
      const addedBlog = await blogService.addBlog(blogObject)
      addedBlog.user = userObject
      dispatch(addBlog(addedBlog))
      dispatch(
        showNotification(
          `Added blog: ${addedBlog.title} by ${addedBlog.author}`,
          5,
        ),
      )
    } catch (error) {
      dispatch(showErrorMessage('Failed to add blog', 5))
    }
  }
}

export const likeBlog = blogObject => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.updateBlog(blogObject.id, {
        ...blogObject,
        likes: blogObject.likes + 1,
      })
      dispatch(updateBlog(updatedBlog))
      dispatch(
        showNotification(
          `Liked blog: ${updatedBlog.title} by ${updatedBlog.author}`,
          5,
        ),
      )
    } catch (error) {
      dispatch(showErrorMessage('Failed to like blog', 5))
    }
  }
}

export const deleteBlog = blogObject => {
  return async dispatch => {
    try {
      await blogService.deleteBlog(blogObject.id)
      dispatch(removeBlog(blogObject))
      dispatch(showNotification(`Blog ${blogObject.title} was deleted`, 5))
    } catch (error) {
      dispatch(showErrorMessage('Deleting blog failed', 5))
    }
  }
}

export default blogSlice.reducer
