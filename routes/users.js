const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser]

// GET the current user
router.get("/", userMW, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log('GETTING USER FAILED: ' + err.message);
    res.status(500).json({ message: 'Internal Server Error'})
  }
})

// GET all users
router.get('/all', userMW, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log('GETTING USERS FAILED: ' + err.message);
    res.status(500).json({ message: 'Internal Server Error'});
  }
});

// PATCH the current user's email
router.patch('/change_email', userMW, async (req, res) => {
  try {
    // Check if there is email input
    if (req.body.email === null) {
      return res.status(400).json({ 
        message: 'Bad request, email input required.'
      });
    }

    // Check if requesting user has given a different email from their current email
    if (req.user.email === req.body.email) {
      return res.status(400).json({ 
        message: 'Bad request, please input a different email from currently registered email.'
      })
    }

    // Check if there is already a registered account with the input email
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Bad request, a user with that email already exists.'
      });
    }

    // All checks passed, save new user email
    req.user.email = req.body.email;
    const updatedUser = await req.user.save();
    res.status(201).json({ updatedUser, message: 'Email successfully changed.' });
  } catch (err) {
    console.log('CHANGING USER EMAIL FAILED: ' + err.message);
    res.status(500).json({ message: 'Internal Server Error'});
  }
});

router.patch('/change_password', userMW, async (req, res) => {
  try {
    // Check if there is password input
    if (req.body.password === null) {
      return res.status(400).json({ message: 'Bad request, password input required.'});
    }

    // Check if requesting user has given a different password from their current password
    if (await bcrypt.compare(req.body.password, req.user.password)) {
      return res.status(400).json({ 
        message: 'Bad request, please input a different password from current password.'
      })
    }

    // All checks passed, save new (hashed) user password
    const hashedNewPassword = await bcrypt.hash(req.body.password, 10);
    req.user.password = hashedNewPassword;
    const updatedUser = await req.user.save();
    res.status(201).json({ updatedUser, message: 'Password successfully changed.'});
  } catch (err) {
    console.log('CHANGING USER PASSWORD FAILED: ' + err.message);
    res.status(500).json({ message: 'Internal Server Error'});
  }
});

module.exports = router;