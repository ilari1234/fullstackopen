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
import { Routes, Route, Link as RouterLink, useMatch } from 'react-router-dom'
import { Container } from '@mui/material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Link from '@mui/material/Link'

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
    <Container>
      <Notification />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Bloglist
            </Typography>
            <Link component={RouterLink} style={padding} color="inherit" to="/">
              Blogs
            </Link>
            <Link
              component={RouterLink}
              style={padding}
              color="inherit"
              to="/users"
            >
              Users
            </Link>
            <Typography>{user.name} is logged in</Typography>
            <Button onClick={handleLogout} color="inherit">
              Log out
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User user={blogUser} />} />
        <Route path="/blogs/:id" element={<BlogDetail blog={blog} />} />
      </Routes>
    </Container>
  )
}

export default App
