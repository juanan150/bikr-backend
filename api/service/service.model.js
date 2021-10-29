const mongoose = require('mongoose')

const ServiceSchema = mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    serviceDetails: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Service = mongoose.model('Service', ServiceSchema)

module.exports = Service
