/**
 * Main app routes
 */

const user = require('./api/user')
const repairShop = require('./api/repairShop')
const transaction = require('./api/transaction')

module.exports = (app) => {
  app.use('/api/users', user)
  app.use('/api/repairshops', repairShop)
  app.use('/api/transactions', transaction)
}
