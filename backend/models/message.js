const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderName: String,

    email: String,

    message: String,

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);