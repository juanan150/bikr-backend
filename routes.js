/**
 * Main app routes
 */

const user = require("./api/user");
const repairShop = require("./api/repairShop");

module.exports = app => {
  app.use("/api/users", user);
  app.use("/api/repairshops", repairShop);
};
