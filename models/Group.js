const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  }
})