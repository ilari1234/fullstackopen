import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import Login from './components/Login'
import UserList from './components/UserList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { setUser, loginUser, logoutUser } from './reducers/userReducer'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const user = useSelector(state => state.user)

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
      <Router>
        <div>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/blogs">
            blogs
          </Link>
          <Link style={padding} to="/users">
            users
          </Link>
        </div>
        <Routes>
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
