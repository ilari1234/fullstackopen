import { useState, useEffect } from 'react'
import userService from '../services/users'

const UserList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then(users => setUsers(users))
  }, [])

  return (
    <>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default UserList
