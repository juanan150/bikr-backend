const Router = require('express').Router

const controller = require('./transaction.controller')
const auth = require('../../auth')

const app = new Router()

app.post('/', auth.auth, controller.payService)

module.exports = app
