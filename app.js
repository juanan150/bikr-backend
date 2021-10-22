const express = require('express')

const connectDB = require('./database')
const expressConfig = require('./config/express')
const config = require('./config')
const routesConfig = require('./routes')
const bb = require('express-busboy')

connectDB()

const app = express()

expressConfig(app)
bb.extend(app, {
  upload: true,
  path: 'uploads',
  allowedPath: /./,
  mimeTypeLimit: ['image/jpeg', 'image/png'],
})
routesConfig(app)

function startServer() {
  const PORT = config.port
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} ...`)
  })
}

setImmediate(startServer)

module.exports = app
