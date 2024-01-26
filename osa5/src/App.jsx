import { useState, useEffect } from 'react'
import Blogs from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const showNotificationMessage = message => {
    setNotificationMessage(message)
    setTimeout(() => { setNotificationMessage(null) }, 5000)
  }

  const showErrorMessage = message => {
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login(
        {
          username: event.target.username.value,
          password: event.target.password.value
        }
      )
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      showErrorMessage('Wrong username or password')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    showNotificationMessage("Logged out from the system")
  }

  const handleAddingBlog = async (event) => {
    event.preventDefault()

    try {
      const addedBlog = await blogService.addBlog(
        {
          title: event.target.title.value,
          author: event.target.author.value,
          url: event.target.url.value
        }
      )
      setBlogs(blogs.concat(addedBlog))
      showNotificationMessage(`A new blog ${addedBlog.title} added`)
    } catch (exception) {
      showErrorMessage('Adding blog failed')
    }
  }

  if (user === null) {
    return (
      <>
        <Notification message={notificationMessage} className={'notification'} />
        <Notification message={errorMessage} className={'error'} />
        <Login handleLogin={handleLogin} />
      </>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} className={'notification'} />
      <Notification message={errorMessage} className={'error'} />
      <h2>Blogs</h2>
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>Log out</button>
      <Blogs blogs={blogs} handleAddingBlog={handleAddingBlog} />
    </div>
  )
}

export default App