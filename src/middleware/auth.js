const authAdmin = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthenticated = token === "xyz";
  console.log("Auhentication done!!");
  if (!isAdminAuthenticated) {
    res.status(401).send("User is unauthorized");
  } else {
    next();
  }
};
module.exports = {
  authAdmin,
};
