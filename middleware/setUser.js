const User = require('../models/User');

async function setUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.user.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user'})
    }
  } catch (err) {
    console.log('GETTING USER FAILED: ' + err.message);
    return res.status(500).json({ message: e.message})    
  }

  req.user = user;
  next();
}

module.exports = setUser;