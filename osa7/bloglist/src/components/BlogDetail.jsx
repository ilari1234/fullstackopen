import { useDispatch } from 'react-redux'
import { likeBlog, commentBlog } from '../reducers/blogReducer'
import { useState } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Card, CardContent, CardActions } from '@mui/material'
import List from '@mui/material/List'
import Link from '@mui/material/Link'

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
      <Card>
        <CardContent>
          <Typography variant="h6">{blog.title}</Typography>
          <Link href={blog.url}>{blog.url}</Link>
          <Typography>{blog.likes} likes</Typography>
          <Typography>added by {blog.user.name}</Typography>
          <Typography variant="h6">Comments</Typography>
          <List>
            {blog.comments.map(comment => (
              <li key={comment}>{comment}</li>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <form onSubmit={addComment}>
            <TextField
              placeholder="Comment here"
              type="text"
              value={comment}
              name="comment"
              id="comment"
              onChange={({ target }) => setComment(target.value)}
            />
            <Button color="primary" variant="contained" type="submit">
              Add comment
            </Button>
          </form>
          <Button color="primary" variant="contained" onClick={addLike}>
            like
          </Button>
        </CardActions>
      </Card>
    </>
  )
}

export default BlogDetail
