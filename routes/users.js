const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Getting all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message});
  }
});

// Updating a user
router.patch('/:id', authenticateToken, async (req, res) => {
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }

  if (req.body.password != null) {
    res.user.password = req.body.password;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json({ message: e.message});
  }

});

// Deleting a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.status(200).json({ message: "User deleted"});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user'})
    }
  } catch (e) {
    return res.status(500).json({ message: e.message})    
  }

  res.user = user;
  next();
}

module.exports = router;