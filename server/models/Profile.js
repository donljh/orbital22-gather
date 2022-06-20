const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    unique: true,
  },
  name: { 
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Profile', profileSchema);