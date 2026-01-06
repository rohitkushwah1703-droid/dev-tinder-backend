const express = require("express");
const { authAdmin } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

const mongoose = require("mongoose");

requestRouter.post("/send/:status/:toUserId", authAdmin, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;

    // Ensure status is valid
    const allowedStatus = ["ignored", "intrested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `${status} is not a valid status type` });
    }

    // Check if user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found in DB!!" });
    }

    // Check for existing active connection request
    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
      status: { $in: ["intrested", "accepted"] }, // only active connections
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists!!" });
    }

    // Create new request
    const newRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await newRequest.save();

    res.status(201).json({
      message: `${req.user.firstName} ${status} ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

requestRouter.post(
  "/review/:status/:requestId",
  authAdmin,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is not valid" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request is not valid!!" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(201).json({ message: `Connection requst is ${status}`, data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;
