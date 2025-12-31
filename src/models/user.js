const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid --" + value);
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid!!");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the User",
    },
    photoUrl: {
      type: String,
      default:
        "https://www.clipartmax.com/png/small/144-1442578_flat-person-icon-download-dummy-man.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a valid url --", value);
        }
      },
    },
    skills: {
      type: [String],
      validate: (value) => {
        return value.length <= 5;
      },
      message: "you can add only 5 skills",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "JWTTinder@123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
