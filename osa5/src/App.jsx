import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
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

  const createBlog = async (blogObject) => {
    try {
      const addedBlog = await blogService.addBlog(blogObject)
      addedBlog.user =
      {
        username: user.username,
        name: user.name
      }
      setBlogs(blogs.concat(addedBlog))
      blogFormRef.current.toggleVisibility()
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
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
      <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    </div>
  )
}

export default App