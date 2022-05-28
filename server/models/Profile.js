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
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }
  ]
})

module.exports = mongoose.model('Profile', profileSchema);