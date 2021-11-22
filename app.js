express = require('express')
const config = require('./utils/config')
require('express-async-errors')
const mongoose = require('mongoose')
const cors = require('cors')

const logger = require('./utils/logger')
const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')

app = express()

mongoose.connect(config.MONGOURL).then(()=>{
    logger.info('Conected to MongoDB')
})
.catch((error)=>{
    logger.error('error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
//app.use(middleware.getTokenFrom)
app.use('/api/blogs',notesRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports=app