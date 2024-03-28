import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Card, CardContent } from '@mui/material'

const User = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="h7">Added blogs</Typography>
        <List disablePadding={true} dense={true} sx={{ listStyleType: 'disc' }}>
          {user.blogs.map(blog => (
            <ListItem key={blog.id} sx={{ display: 'list-item' }}>
              {blog.title}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default User
