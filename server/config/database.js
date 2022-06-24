const mongoose = require("mongoose");

const { DB_URI } = process.env;

const connectToDB = () => {
	// Connect to MongoDB
	mongoose
		.connect(DB_URI)
		.then(() => {
			console.log("Successfully connected to database");
		})
		.catch((error) => {
			console.log("Failed to connect to database. Exiting now...");
			console.error(error);
			process.exit(1);
		});
};

module.exports = connectToDB;
