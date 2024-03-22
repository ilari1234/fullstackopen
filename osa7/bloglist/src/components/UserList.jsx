import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeBlogUsers } from '../reducers/blogUserReducer'

const UserList = () => {
  const users = useSelector(state => state.blogUsers)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogUsers())
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
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default UserList
