require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL_NOADMIN);
const db = mongoose.connection;

db.on('error', e => console.error(e));
db.once('open', e => console.log('Connected to DB'));

app.listen(3000, () => console.log('Server Started'));

app.use(express.json())

app.use("/users", require('./routes/users'));
