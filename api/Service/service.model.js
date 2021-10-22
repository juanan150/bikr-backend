const mongoose = require('mongoose')

const ServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    imageUrl: {
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
