const mongoose = require('mongoose')
const config = require('./config')

async function connectDB() {
  mongoose.connect(config.mongo_uri, {
    useNewUrlParser: true,
  })

  mongoose.connection.on('error', function (e) {
    console.error(e)
    process.exit(-1)
  })
}

module.exports = connectDB
