const jwt = require('jsonwebtoken')
const User = require('../api/user/user.model')
const config = require('../config')

const auth = async (req, res, next) => {
  try {
    const token = req.get('Authorization')
    const data = jwt.verify(token, config.jwtKey)

    const user = await User.findOne({ _id: data.userId })

    if (user) {
      res.locals.user = user
      next()
    } else {
      res.status(401).json({ error: 'User not found' })
      return
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid Token' })
      return
    }
    next(err)
  }
}

const authOwner = async (req, res, next) => {
  try {
    const token = req.get('Authorization')
    const data = jwt.verify(token, config.jwtKey)

    const user = await User.findOne({ _id: data.userId })

    if (user) {
      if (user.role === 'owner') {
        res.locals.user = user
        next()
      } else {
        res.status(403).json({ error: "User doesn't have permissions" })
        return
      }
    } else {
      res.status(401).json({ error: 'User not found' })
      return
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid Token' })
      return
    }
    next(err)
  }
}

module.exports = { auth, authOwner }
