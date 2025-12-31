const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { authAdmin } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req?.body;
    //validate the req data
    validateSignupData(req);

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.send("User saved successfully!!");
  } catch (error) {
    res.status(400).send("User is not saved" + error.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials!!");
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token);
      res.cookie("token", token);
      res.send("Login Successfull!!");
    } else {
      throw new Error("Invalid Credentials!!");
    }
  } catch (error) {
    res.status(400).send("ERROR-" + error.message);
  }
});

app.get("/profile", authAdmin, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("ERROR-" + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const userData = await User.find({});
    console.log(userData);
    res.send(userData);
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//update the user
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const ALLLOWED_FIELDS = ["age", "about", "photoUrl", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLLOWED_FIELDS.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updated is not allowed");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successdully!!");
  } catch (error) {
    res.status(400).send("Something went wrong!!" + error.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connection establised!!");
    app.listen(3000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log("Database connection is not establised");
  });
