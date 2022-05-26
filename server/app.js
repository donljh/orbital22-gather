require("dotenv").config();
require("./config/database")(); // Connect to DB
const cors = require('cors');

const routeLogger = require('./middleware/routeLogger');

const express = require("express");
const app = express();  

app.use(express.json()); // to support JSON-encoded bodies
app.use(routeLogger); // Logs API route hit on any API call
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

module.exports = app;