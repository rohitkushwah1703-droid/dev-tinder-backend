const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req;

  if (!firstName || !lastName) {
    throw new Error("Please enter the name");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please eneter a strong password");
  }
};

const validateUpdateData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "gender",
    "photoUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignupData,
  validateUpdateData,
};
