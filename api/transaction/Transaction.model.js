const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    repairShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repairshop",
      required: true,
    },
    bill: {
      type: String,
    },
    scheduleDate: {
      type: String,
    },
    epaycoRef: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const RepaiShop = mongoose.model("Transaction", TransactionSchema);

module.exports = RepaiShop;
