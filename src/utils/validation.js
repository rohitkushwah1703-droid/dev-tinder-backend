const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter the name");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please eneter a strong password");
  }
};
module.exports = {
  validateSignupData,
};
