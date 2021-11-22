const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: 'HTML is easy',
      author: 'Edward',
      url: 'www.amazon.com',
      likes:2
    },
    {
      title: 'Javascript is powerfull',
      author: 'Bill Gates',
      url: 'www.microsoft.com',
      likes:6
    },
    {
      title: '.NET Futher',
      author: 'Bill Gates',
      url: 'www.microsoft.com',
      likes:3
    },
  ]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'xxxX', author:'xxx' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb,
}