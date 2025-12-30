const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Rohit",
    lastName: "Kushwah",
    emailId: "rohit.kushwah@.com",
    password: "rohit993",
    gender: "male",
    age: 30,
  });
  await user.save();
  res.send("User saved successfully!!");
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
