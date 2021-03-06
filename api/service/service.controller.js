const Service = require('./service.model')

const createService = async (req, res, next) => {
  try {
    const newService = await new Service(req.body)
    await newService.save()

    res.status(201).json({
      newService,
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).json(err.errors)
    } else if (err.name === 'MongoServerError') {
      res.status(400).json({
        error: 'Email is already taken, please try with a different email',
      })
    } else {
      next(err)
    }
  }
}

const listServices = async (req, res, next) => {
  try {
    const services = await Service.find({}, null)
    res.status(200).json({ services })
  } catch (e) {
    next(e)
  }
}

module.exports = { createService, listServices }
