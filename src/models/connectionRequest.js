const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    fromUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is not valid status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Connection reuest can not be send to yourself!!");
  }
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
