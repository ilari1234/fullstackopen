const _ = require('lodash')


// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((previousBlog, currentBlog) => {
    return previousBlog.likes > currentBlog.likes ? previousBlog : currentBlog
  }, {})
}

const mostBlogs = (blogs) => {
  return _
    .chain(blogs)
    .countBy('author')
    .toPairs()
    .maxBy()
    .thru((blog) => (blog ? { author: blog[0], blogs: blog[1] } : {}))
    .value()
}

const mostLikes = (blogs) => {
  return _
    .chain(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, 'likes')
    }))
    .maxBy('likes')
    .thru((blog) => (blog ? blog : {}))
    .value()
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}