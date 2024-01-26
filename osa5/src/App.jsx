import { useState, useEffect } from 'react'
import Blogs from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
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
    } catch (exception) {
      setErrorMessage('Adding blog failed')
      console.error(exception.message)
    }
  }

  if (user === null) {
    return (
      <Login handleLogin={handleLogin} />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>Log out</button>
      <Blogs blogs={blogs} handleAddingBlog={handleAddingBlog} />
    </div>
  )
}

export default App