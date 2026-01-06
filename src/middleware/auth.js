const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authAdmin = async (req, res, next) => {
  try {
    const { token } = req?.cookies;
    console.log("token", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "User is unauthorised!!  Please login" });
    }
    const decodeobj = await jwt.verify(token, "JWTTinder@123");
    const { _id } = decodeobj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR-" + error.message);
  }
};
module.exports = {
  authAdmin,
};
