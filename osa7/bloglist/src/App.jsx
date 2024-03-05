import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => {
      if (a.likes > b.likes) {
        return -1
      }
    })
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogs(blogs)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (userObject) => {
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

  const createBlog = async (blogObject) => {
    try {
      const addedBlog = await blogService.addBlog(blogObject)
      addedBlog.user = {
        username: user.username,
        name: user.name,
      }
      setBlogs(blogs.concat(addedBlog))
      blogFormRef.current.toggleVisibility()
      dispatch(showNotification(`A new blog ${addedBlog.title} added`, 5))
    } catch (exception) {
      dispatch(showErrorMessage('Adding blog failed', 5))
    }
  }

  const updateLikes = async (blogObject) => {
    try {
      const updatedBlog = await blogService.updateBlog(
        blogObject.id,
        blogObject,
      )
      setBlogs(
        sortBlogs(
          blogs.map((blog) =>
            blog.id !== updatedBlog.id
              ? blog
              : { ...blog, likes: blog.likes + 1 },
          ),
        ),
      )
      dispatch(showNotification(`A blog ${updatedBlog.title} was liked`, 5))
    } catch (exception) {
      dispatch(showErrorMessage('Updating blog failed', 5))
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      if (
        window.confirm(
          `Do you really wan to delete ${blogObject.title} from the list?`,
        )
      ) {
        await blogService.deleteBlog(blogObject.id)
        setBlogs(sortBlogs(blogs.filter((blog) => blog.id !== blogObject.id)))
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
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
          username={user.username}
        />
      ))}
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    </div>
  )
}

export default App
