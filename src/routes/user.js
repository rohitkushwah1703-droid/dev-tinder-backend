const express = require("express");
const { authAdmin } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const user = require("../models/user");
const userRouter = express.Router();

SAFE_FIELDS = "firstName lastName age gender about photoUrl";

userRouter.get("/pendingRequests", authAdmin, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", SAFE_FIELDS);
    res.status(201).json({
      message: "Data fetched Successfully!!",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/myConnections", authAdmin, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_FIELDS)
      .populate("toUserId", SAFE_FIELDS);
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(201).json({
      message: "Data fecthed Successfully !!",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/feed", authAdmin, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      status: { $in: ["accepted", "intrested"] },
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    console.log(connectionRequest);

    const excludedUserIds = new Set();

    connectionRequest.forEach((r) => {
      excludedUserIds.add(r.fromUserId.toString());
      excludedUserIds.add(r.toUserId.toString());
    });
    const users = await User.find({
      _id: {
        $nin: Array.from(excludedUserIds),
        $ne: loggedInUser._id.toString(),
      },
    })
      .select(SAFE_FIELDS)
      .skip(skip)
      .limit(limit)
      .lean();
    res.status(201).json({
      message: "Data fetched successfully!!",
      data: users,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
