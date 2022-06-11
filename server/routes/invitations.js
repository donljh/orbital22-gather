const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const User = require('../models/User')
const Group = require('../models/Group');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser]