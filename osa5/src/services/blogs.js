import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const updateBlog = async (id, blog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, addBlog, updateBlog, deleteBlog, setToken }