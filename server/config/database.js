const mongoose = require('mongoose');

const { DB_URI_NOADMIN } = process.env;

const connectToDB = () => {
  // Connect to MongoDB
mongoose
  .connect(DB_URI_NOADMIN)
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.log("Failed to connect to database. Exiting now...");
    console.error(error);
    process.exit(1);
  });
}

module.exports = connectToDB;