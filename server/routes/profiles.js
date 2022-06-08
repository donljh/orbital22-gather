const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const setUser = require('../middleware/setUser');

const Profile = require('../models/Profile');

// Middleware to authenticate and set request user to be same as user in DB
// req.user --> user (in DB)
const userMW = [auth, setUser]

// GET profile of currently logged in user
router.get('/', userMW, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    })

    if (profile === null) {
      return res.status(404).message({ message: 'Profile cannot be found.'})
    }

    console.log('GETTING PROFILE: ' + profile);
    res.status(200).json(profile);
  } catch (err) {
    console.log('GETTING PROFILE FAILED: ' + err.message);
    res.status(500).json({ message: err.message });
  }
})

// PATCH name of currently logged in user
router.patch('/change_name', userMW, async (req, res) => {
  console.log(req.body);
  try {
    // Check if there is name input
    if (req.body.name === null) {
      return res.status(400).json({ 
        message: 'Bad request, name input required.'
      });
    }

    const profile = await Profile.findOne({
      user: req.user.id
    })

    // Check if requestin user has given a different name from currently registered name
    if (req.body.name === profile.name) {
      return res.status(400).json({ 
        message: 'Bad request, please input a different name from current name'
      });
    }

    if (!profile) {
      return res.status(404).message({ 
        message: 'Profile cannot be found.'
      })
    }

    profile.name = req.body.name;
    const updatedProfile = await profile.save();
    res.status(200).json({ updatedProfile, message: 'Profile name has been updated' });
  } catch (err) {
    console.log('CHANGING PROFILE NAME FAILED: ' + err.message);
    res.status(500).json({ message: err.message });
  }
})


module.exports = router;