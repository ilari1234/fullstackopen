import { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    handleLogin(
      {
        username: username,
        password: password
      }
    )

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login to the system</h2>
      <form onSubmit={login}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            id="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default Login
