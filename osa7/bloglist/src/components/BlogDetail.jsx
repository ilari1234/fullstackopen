import { useDispatch } from 'react-redux'
import { likeBlog } from '../reducers/blogReducer'

const BlogDetail = ({ blog }) => {
  const dispatch = useDispatch()
  if (!blog) {
    return null
  }

  const addLike = async () => {
    dispatch(likeBlog(blog))
  }
  return (
    <>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes</p>
      <button onClick={addLike}>like</button>
      <p>added by {blog.user.name}</p>
    </>
  )
}

export default BlogDetail
