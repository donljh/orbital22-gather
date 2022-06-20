const mongoose = require('mongoose');

const sharedTaskSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group'
  },
  accepted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  completed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  title: {
    type: String,
    required: true
  },
  description: String,
  dueDate: Date
})

module.exports = mongoose.model('SharedTask', sharedTaskSchema);