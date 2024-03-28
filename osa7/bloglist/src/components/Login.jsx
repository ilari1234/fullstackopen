import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = event => {
    event.preventDefault()
    handleLogin({
      username: username,
      password: password,
    })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login to the system</h2>
      <form onSubmit={login}>
        <div>
          <TextField
            type="text"
            value={username}
            name="Username"
            id="username"
            label="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            type="password"
            value={password}
            name="Password"
            id="password"
            label="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default Login
