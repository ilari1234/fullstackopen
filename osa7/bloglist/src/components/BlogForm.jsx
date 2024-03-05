import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

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

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm