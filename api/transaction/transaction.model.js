const mongoose = require('mongoose')

const TransactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    repairShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repairshop',
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    bill: {
      type: String,
    },
    scheduleDate: {
      type: Number,
    },
    epaycoRef: {
      type: String,
    },
    value: {
      type: Number,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

const RepaiShop = mongoose.model('Transaction', TransactionSchema)

module.exports = RepaiShop
