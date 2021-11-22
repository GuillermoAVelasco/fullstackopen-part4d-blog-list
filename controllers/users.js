const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const reg = /^[A-Za-z]{3}[0-9]{3}$/;
  if(!reg.test(body.username)){
    return response.status(401).json({ error: 'Username malformed, 3 letter and numbers required' })
  }

  if(!reg.test(body.password)){
    return response.status(401).json({ error: 'Password malformed, 3 letter and numbers required' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs',{ title: 1, author: 1, url:1, likes:1 })

  response.json(users)
})

module.exports = usersRouter