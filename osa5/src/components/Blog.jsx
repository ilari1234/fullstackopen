import { useState, useImperativeHandle, forwardRef } from 'react'

const Blog = ({ blog, updateLikes }) => {
  const [showAll, setShowAll] = useState(false)

  const hideWhenShowAll = { display: showAll ? 'none' : '' }
  const showWhenShowAll = { display: showAll ? '' : 'none' }

  const toggleShowAll = () => {
    setShowAll(!showAll)
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
          </tbody>
        </table>
      </div >
    </div>)
}


export default Blog