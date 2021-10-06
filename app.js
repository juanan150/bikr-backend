const express = require("express");

const connectDB = require("./database");
const expressConfig = require("./config/express");
const config = require("./config");

connectDB();

const app = express();

expressConfig(app);

function startServer() {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} ...`);
  });
}

setImmediate(startServer);

module.exports = app;
