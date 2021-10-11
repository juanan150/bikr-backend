const Router = require("express").Router;

const controller = require("./user.controller");

const app = new Router();

app.post("/login", controller.login);
app.post("/signup", controller.signup);

module.exports = app;
