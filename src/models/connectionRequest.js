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


// if we make query ConnectionRequest.findOne({fromUserId: 987654dvbnki76, toUserId: 987654edcvbnhjuk })  this compound indexing will make it more faster
// and here 1 means ascending and -1 means decending -------- and here we search with 2 parameters thats why we indexed 2 para
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

// Checks before pre-saving the new instance into the schema
connectionRequestSchema.pre("save", async function(next) {
  // 'this' refers to the document being saved
  const connectionRequest = this;
  
  // Check if the fromUserId is the same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    // This will throw an error, which will be caught by the .catch() in the route handler
    throw new Error("You cannot send a connection request to yourself.");
  }

  // If validation passes, proceed to the next middleware (or the save operation)
  next();
});

const ConnectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;