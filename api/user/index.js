const Router = require("express").Router;

const controller = require("./user.controller");
const auth = require("../../auth");

const app = new Router();

app.post("/login", controller.login);
app.post("/signup", controller.signup);
app.get("/me", auth, controller.loadUser);

module.exports = app;
