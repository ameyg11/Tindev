const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequestModel = mongoose.Model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;