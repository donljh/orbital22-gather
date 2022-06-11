const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invited_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Invitation', invitationSchema);