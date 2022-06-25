const mongoose = require('mongoose');

const sharedEventSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group'
  },
  accepted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  }
})

module.exports = mongoose.model('SharedEvent', sharedEventSchema);