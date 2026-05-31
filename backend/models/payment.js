const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    amount: Number,

    paymentDate: Date,

    paymentMethod: String,

    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);