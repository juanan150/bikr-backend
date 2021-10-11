const mongoose = require("mongoose");

const RepairShopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    services: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Repairshop = mongoose.model("Repairshop", RepairShopSchema);

module.exports = Repairshop;