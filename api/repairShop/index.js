const Router = require("express").Router;

const controller = require("./repairShop.controller");
const auth = require("../../auth");

const app = new Router();

app.get("/", controller.listRepairShops);
app.post("/", auth, controller.createRepairShop);
app.delete("/:id", auth, controller.deleteRepairShop);

module.exports = app;
