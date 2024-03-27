import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardActions, Typography } from '@mui/material'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Blog = ({ blog }) => {
  const [showRemove, setShowRemove] = useState(false)
  const user = useSelector(state => state.user)

  const showWhenShowRemove = { display: showRemove ? '' : 'none' }

  const checkOwner = () => {
    if (blog.user.username === user.username) {
      setShowRemove(true)
    }
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
    <div>
      <Accordion onChange={checkOwner}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            <span> by: {blog.author}</span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card>
            <CardContent>
              <Typography id="url">Blog url: {blog.url}</Typography>
              <Typography id="likes"> Likes: {blog.likes}</Typography>
              <Typography id="username">Added by {blog.user.name}</Typography>
            </CardContent>
            <CardActions>
              <Button id="likeButton" onClick={addLike}>
                Like
              </Button>
              <Button
                id="deleteButton"
                style={showWhenShowRemove}
                onClick={removeBlog}
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
