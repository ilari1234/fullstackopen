import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  const addBlog = async event => {
    event.preventDefault()
    dispatch(
      createBlog(
        {
          title: title,
          author: author,
          url: url,
        },
        user,
      ),
    )

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const padding = {
    padding: 10,
  }

  return (
    <div>
      <Typography variant="h5" style={padding}>
        Create a blog
      </Typography>
      <form onSubmit={addBlog}>
        <TextField
          label="Title"
          type="text"
          value={title}
          name="title"
          id="title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label="Author"
          type="text"
          value={author}
          name="author"
          id="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label="Url"
          type="text"
          value={url}
          name="url"
          id="url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button type="submit" color="primary" variant="contained">
          Add blog
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
