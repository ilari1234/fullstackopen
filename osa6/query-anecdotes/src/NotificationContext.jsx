/* eslint-disable react/prop-types */
import React, { createContext, useContext, useReducer } from 'react'


const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotificationContent = () => {
  const useAndDispatch = useContext(NotificationContext)
  return useAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const useAndDispatch = useContext(NotificationContext)
  return useAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext