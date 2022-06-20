const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  admins: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    ],
    validate: [array => array.length > 0, 'No admin']
  },
  members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    ],
    validate: [array => array.length > 0, 'No members']
  },
  invitations: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invitation',
      }
    ]
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Group', groupSchema);