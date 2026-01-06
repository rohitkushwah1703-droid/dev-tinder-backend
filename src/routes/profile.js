const express = require("express");
const { authAdmin } = require("../middleware/auth");
const User = require("../models/user");
const { validateUpdateData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/view", authAdmin, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("ERROR-" + error.message);
  }
});

//edit profile
profileRouter.patch("/edit", authAdmin, async (req, res) => {
  try {
    const isEditAllowed = validateUpdateData(req);
    if (!isEditAllowed) throw new Error("Edit is not allowed");
    const user = req.user;
    Object.keys(req.body).forEach((u) => (user[u] = req.body[u]));
    await user.save();

    res.status(201).json({
      message: `${user.firstName}, your profile is updated successfully!`,
      user,
    });
  } catch (error) {
    res.status(400).send("ERROR-" + error.message);
  }
});

//update password

profileRouter.patch("/password", authAdmin, async (req, res) => {});

profileRouter.get("/feed", authAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Something went wrong...");
  }
});

module.exports = profileRouter;
