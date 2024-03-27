import { useDispatch } from 'react-redux'
import { likeBlog, commentBlog } from '../reducers/blogReducer'
import { useState } from 'react'

const BlogDetail = ({ blog }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  if (!blog) {
    return null
  }

  const addLike = async () => {
    dispatch(likeBlog(blog))
  }

  const addComment = event => {
    event.preventDefault()
    dispatch(commentBlog(blog, comment))
    setComment('')
  }

  return (
    <>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes</p>
      <button onClick={addLike}>like</button>
      <p>added by {blog.user.name}</p>
      <h2>Comments</h2>
      <ul>
        {blog.comments.map(comment => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          name="comment"
          id="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">Add comment</button>
      </form>
    </>
  )
}

export default BlogDetail
