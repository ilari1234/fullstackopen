import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const [showAll, setShowAll] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const user = useSelector(state => state.user)

  const hideWhenShowAll = { display: showAll ? 'none' : '' }
  const showWhenShowAll = { display: showAll ? '' : 'none' }
  const showWhenShowRemove = { display: showRemove ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
    if (blog.user.username === user.username) {
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
    dispatch(likeBlog(blog))
  }

  const removeBlog = async () => {
    if (
      window.confirm(
        `Do you really want to remove ${blog.title} from the list?`,
      )
    ) {
      dispatch(deleteBlog(blog))
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
}

export default Blog
