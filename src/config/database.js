const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://rohitkushwah1703_db_user:6KQ7dwNr69yIx10J@cluster0.7z0f0u3.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
