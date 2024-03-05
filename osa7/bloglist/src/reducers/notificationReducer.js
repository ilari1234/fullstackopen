import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: () => null,
  },
})

export const showNotification = (message, timeout) => {
  return (dispatch) => {
    dispatch(setNotification({ message: message, type: 'notification' }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}

export const showErrorMessage = (message, timeout) => {
  return (dispatch) => {
    dispatch(setNotification({ message: message, type: 'error' }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
