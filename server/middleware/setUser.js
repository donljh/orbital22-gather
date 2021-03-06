const User = require('../models/User');

// Set requesting user to be the user model in DB, based on requesting user ID
async function setUser(req, res, next) {
  let user;
  try {
    console.log('REQUESTING USER:' + req.user.id);
    user = await User.findById(req.user.id)
    if (user === null) {
      return res.status(404).json({ message: 'User cannot be found.'})
    }
  } catch (err) {
    console.log('GETTING USER FAILED: ' + err.message);
    return res.status(500).json({ message: err.message})    
  }

  req.user = user;
  next();
}

module.exports = setUser;