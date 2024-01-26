import { useState } from 'react'



const BlogForm = ({ handleAddingBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a blog</h2>
      <form onSubmit={handleAddingBlog}>
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

const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
)

const Blogs = ({ blogs, handleAddingBlog }) => {
  return (
    <div>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
      <BlogForm handleAddingBlog={handleAddingBlog} />
    </div>
  )
}


export default Blogs