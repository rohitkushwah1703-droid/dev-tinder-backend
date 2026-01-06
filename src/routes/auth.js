const express = require("express");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      photoUrl,
      about,
      skills,
    } = req?.body;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      gender,
      age,
      photoUrl,
      about,
      skills,
    });

    await user.save();
    res.status(201).send({ message: "User saved successfully!!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials!!");
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid)
      res.status(401).json({ message: "Invalid Credentials!!" });

    const token = await user.getJWT();
    console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Login Successfull!", data: user });
  } catch (error) {
    res.status(400).json({ "error-": error.message });
  }
});

//logout api
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(201)
    .json({ message: "Logout Successfull!" });
});

module.exports = authRouter;
