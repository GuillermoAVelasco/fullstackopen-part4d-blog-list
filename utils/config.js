require('dotenv').config()
const PORT = process.env.PORT
let MONGOURL = process.env.MONGOURL

if (process.env.NODE_ENV === 'test') {
    MONGOURL = process.env.TEST_MONGOURL
}
  

module.exports={ PORT , MONGOURL }