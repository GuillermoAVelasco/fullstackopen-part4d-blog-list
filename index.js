const server = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT,()=>{
    logger.info(`Servidor corriendo en ${config.PORT}`)
})

