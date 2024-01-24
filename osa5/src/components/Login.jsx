const Login = ({ username, password, handleLogin }) => {
  console.log('username: ', username)
  console.log('password: ', password)
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={(event) => username = event.target.value}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => password = target.value}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
