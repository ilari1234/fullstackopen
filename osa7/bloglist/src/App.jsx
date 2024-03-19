import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  showNotification,
  showErrorMessage,
} from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async userObject => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      dispatch(showErrorMessage('Wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    dispatch(showNotification('Logged out from the system', 5))
  }

  const updateLikes = async blogObject => {
    try {
      const updatedBlog = await blogService.updateBlog(
        blogObject.id,
        blogObject,
      )
      /*
      setBlogs(
        sortBlogs(
          blogs.map(blog =>
            blog.id !== updatedBlog.id
              ? blog
              : { ...blog, likes: blog.likes + 1 },
          ),
        ),
      )
      */
      dispatch(showNotification(`A blog ${updatedBlog.title} was liked`, 5))
    } catch (exception) {
      dispatch(showErrorMessage('Updating blog failed', 5))
    }
  }

  const deleteBlog = async blogObject => {
    try {
      if (
        window.confirm(
          `Do you really wan to delete ${blogObject.title} from the list?`,
        )
      ) {
        await blogService.deleteBlog(blogObject.id)
        //setBlogs(sortBlogs(blogs.filter(blog => blog.id !== blogObject.id)))
        dispatch(showNotification(`Blog ${blogObject.title} was deleted`, 5))
      }
    } catch (exception) {
      dispatch(showErrorMessage('Deleting blog failed', 5))
    }
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <Login handleLogin={handleLogin} />
      </>
    )
  }

  return (
    <div>
      <Notification />
      <h2>Blogs</h2>
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>Log out</button>
      <BlogList />
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
    </div>
  )
}

export default App
