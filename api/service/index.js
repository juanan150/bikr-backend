const Router = require('express').Router

const controller = require('./service.controller')
const auth = require('../../auth')

const app = new Router()

app.post('/', auth.authAdmin, controller.createService)

module.exports = app
