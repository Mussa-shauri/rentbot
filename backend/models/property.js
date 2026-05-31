const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "pending"],
      default: "available",
    },
    address: {
      type: String,
      required: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: Number,
    bedrooms: Number,
    bathrooms: Number,
    description: String,
    
    // NEW: Added from Step 1 (Basic Details)
    contactPhone: String,

    // NEW: Added from Step 2 (Amenities)
    amenities: [{
      type: String,
    }],

    // UPDATED: Changed from a single string to an array for multiple photos (Step 3)
    images: [{
      type: String,
    }],

    // NEW: Added from Step 3 (Photos & Videos)
    videoLinks: [{
      type: String,
    }],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);