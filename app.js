require("dotenv").config();
require("./config/database")(); // Connect to DB

const express = require("express");

const app = express();  

app.use(express.json()); // to support JSON-encoded bodies

module.exports = app;