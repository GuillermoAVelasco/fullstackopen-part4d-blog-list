var _ = require('lodash');
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = middleware.getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author:body.author,
    url:body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

const reducer= (sum)=>{ return sum+1}
const mostBlogs  = (blogs) => {
  const xx=_.countBy(_.map(blogs,'author'), reducer)

  const values=Object.values(xx)
  const keys=Object.keys(xx)
  const maximo=(max,e)=> max=Math.max(max,e)
  const max=values.reduce(maximo,0)
  const index = values.findIndex(e => { 
    return e === max
  });

  return JSON.parse(`{"author":"${keys[index].substr(0,keys[0].length-1)}","blogs":${values[index]}}`)

  /*
    return keys.map((e,i)=> {   
      const cadena=`{"author":"${e.substr(0,e.length-1)}","blogs":${values[i]}}`
      return JSON.parse(cadena)    
  })
  */
}

blogsRouter.get('/mostBlogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(mostBlogs(blogs))
})


const mostLikes  = (blogs) => {
  const xx=_.map(blogs,'likes')
  const maximo=_.max(xx)
  return _.filter(_.map(blogs,(e)=>{ 
    return JSON.parse(`{"author":"${e.author}","likes":"${e.likes}"}`) }), (e)=> { 
    return (maximo===Number.parseInt(e.likes))? e.author: false 
  })
}

blogsRouter.get('/mostLikes', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(mostLikes(blogs))
})

blogsRouter.delete('/:id', async (request, response) => {

  const body = request.body

  const token = middleware.getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
    
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() !== user.id.toString())
  {
    return response.status(401).json({ error: 'User distinct creator' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

/*
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
*/

module.exports = blogsRouter