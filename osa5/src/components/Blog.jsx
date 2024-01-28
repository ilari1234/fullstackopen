import { useState } from 'react'

const Blog = ({ blog, username, updateLikes, deleteBlog }) => {
  const [showAll, setShowAll] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  const hideWhenShowAll = { display: showAll ? 'none' : '' }
  const showWhenShowAll = { display: showAll ? '' : 'none' }
  const showWhenShowRemove = { display: showRemove ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
    if (blog.user.username === username) {
      setShowRemove(true)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1 }
    updateLikes(blogToUpdate)
  }

  const removeBlog = () => {
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenShowAll} onClick={toggleShowAll}>View</button>
        <button style={showWhenShowAll} onClick={toggleShowAll}>Hide</button>
      </div>
      <div style={showWhenShowAll}>
        <table>
          <tbody>
            <tr>
              <td>{blog.url}</td>
            </tr>
            <tr>
              <td>Likes: {blog.likes}</td>
              <td><button onClick={addLike}>Like</button></td>
            </tr>
            <tr>
              <td>{blog.user.name}</td>
            </tr>
            <tr style={showWhenShowRemove}>
              <td><button onClick={removeBlog}>Remove</button></td>
            </tr>
          </tbody>
        </table>
      </div >
    </div>)
}


export default Blog