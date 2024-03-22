import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const blogUserSlice = createSlice({
  name: 'blogUsers',
  initialState: [],
  reducers: {
    setBlogUsers: (state, action) => {
      return action.payload
    },
  },
})

export const { setBlogUsers } = blogUserSlice.actions

export const initializeBlogUsers = () => {
  return async dispatch => {
    const blogUsers = await userService.getAll()
    dispatch(setBlogUsers(blogUsers))
  }
}

export default blogUserSlice.reducer
