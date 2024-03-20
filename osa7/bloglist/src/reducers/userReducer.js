import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { showNotification, showErrorMessage } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const loginUser = userObject => {
  return async dispatch => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (error) {
      dispatch(showErrorMessage('Wrong username or password', 5))
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.clear()
    dispatch(setUser(null))
    dispatch(showNotification('Logged out from the system', 5))
  }
}

export default userSlice.reducer
