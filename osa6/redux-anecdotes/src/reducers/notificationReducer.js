import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: () => ''
  }
})

export const showNotification = (notification, timeout) => {
  return dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => { dispatch(clearNotification()) }, timeout * 1000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer