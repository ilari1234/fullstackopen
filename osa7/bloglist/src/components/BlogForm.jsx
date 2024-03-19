import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import {
  showNotification,
  showErrorMessage,
} from '../reducers/notificationReducer'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = async event => {
    event.preventDefault()
    try {
      dispatch(
        createBlog({
          title: title,
          author: author,
          url: url,
        }),
      )
      dispatch(showNotification(`Added blog: ${title} by ${author}`, 5))
    } catch (error) {
      dispatch(showErrorMessage('Failed to add blog', 5))
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a blog</h2>
      <form onSubmit={addBlog}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          value={title}
          name="title"
          id="title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <label htmlFor="author">Author</label>
        <input
          type="text"
          value={author}
          name="author"
          id="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <label htmlFor="url">Url</label>
        <input
          type="text"
          value={url}
          name="url"
          id="url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <button type="submit">Add blog</button>
      </form>
    </div>
  )
}

export default BlogForm
