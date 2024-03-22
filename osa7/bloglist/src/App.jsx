import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import Login from './components/Login'
import UserList from './components/UserList'
import Notification from './components/Notification'
import User from './components/User'
import BlogDetail from './components/BlogDetail'
import blogService from './services/blogs'
import { setUser, loginUser, logoutUser } from './reducers/userReducer'
import { Routes, Route, Link, useMatch } from 'react-router-dom'

const App = () => {
  const user = useSelector(state => state.user)
  const blogUsers = useSelector(state => state.blogUsers)
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [])

  const handleLogin = async userObject => {
    dispatch(loginUser(userObject))
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const match = useMatch('/users/:id')
  const blogUser = match
    ? blogUsers.find(blogUser => blogUser.id === match.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  if (user === null) {
    return (
      <>
        <Notification />
        <Login handleLogin={handleLogin} />
      </>
    )
  }

  const padding = {
    padding: 5,
  }

  return (
    <div>
      <Notification />
      <h2>Blogs</h2>
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>Log out</button>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User user={blogUser} />} />
        <Route path="/blogs/:id" element={<BlogDetail blog={blog} />} />
      </Routes>
    </div>
  )
}

export default App
