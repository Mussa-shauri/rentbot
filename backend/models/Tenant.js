const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    fullName: String,

    phone: String,

    email: String,

    nationalId: String,

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    rentAmount: Number,

    moveInDate: Date,

    status: {
      type: String,
      enum: ["active", "pending", "left"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);