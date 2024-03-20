import { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import {
  showNotification,
  showErrorMessage,
} from '../reducers/notificationReducer'

const Blog = ({ blog, username }) => {
  const [showAll, setShowAll] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  const hideWhenShowAll = { display: showAll ? 'none' : '' }
  const showWhenShowAll = { display: showAll ? '' : 'none' }
  const showWhenShowRemove = { display: showRemove ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
    setShowRemove(true)
    if (blog.user.username === username) {
      setShowRemove(true)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const dispatch = useDispatch()

  const addLike = async () => {
    try {
      dispatch(likeBlog(blog))
      dispatch(
        showNotification(`Liked blog: ${blog.title} by ${blog.author}`, 5),
      )
    } catch (error) {
      dispatch(showErrorMessage('Failed to like blog', 5))
    }
  }

  const removeBlog = async () => {
    try {
      if (
        window.confirm(
          `Do you really want to remove ${blog.title} from the list?`,
        )
      ) {
        dispatch(deleteBlog(blog))
        dispatch(showNotification(`Blog ${blog.title} was deleted`, 5))
      }
    } catch (error) {
      dispatch(showErrorMessage('Deleting blog failed', 5))
    }
  }

  return (
    <div style={blogStyle}>
      <div id="blogShown">
        {blog.title} {blog.author}
        <button style={hideWhenShowAll} onClick={toggleShowAll} id="viewButton">
          View
        </button>
        <button style={showWhenShowAll} onClick={toggleShowAll} id="hideButton">
          Hide
        </button>
      </div>
      <div style={showWhenShowAll} id="blogTogglable">
        <table>
          <tbody>
            <tr>
              <td id="url">{blog.url}</td>
            </tr>
            <tr>
              <td id="likes">Likes: {blog.likes}</td>
              <td>
                <button id="likeButton" onClick={addLike}>
                  Like
                </button>
              </td>
            </tr>
            <tr>
              <td id="username">{blog.user.name}</td>
            </tr>
            <tr style={showWhenShowRemove}>
              <td>
                <button id="deleteButton" onClick={removeBlog}>
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
}

export default Blog
