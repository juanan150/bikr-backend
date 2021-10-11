const Router = require("express").Router;

const controller = require("./repairShop.controller");

const app = new Router();

app.get("/", controller.listRepairShops);

module.exports = app;
