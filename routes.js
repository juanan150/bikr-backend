/**
 * Main app routes
 */

const user = require("./api/user");

module.exports = app => {
  app.use("/api/users", user);
};
