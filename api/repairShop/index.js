const Router = require('express').Router

const controller = require('./repairShop.controller')
const auth = require('../../auth')

const app = new Router()

app.get('/', controller.listRepairShops)
app.post('/', auth.authOwner, controller.createRepairShop)
app.delete('/:id', auth.authOwner, controller.deleteRepairShop)
app.get('/:id', auth.authOwner, controller.getRepairShop)
app.get('/search', auth.auth, controller.searchRepairShops)
app.get('/:id/services', auth.auth, controller.getServices)

module.exports = app
