const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  colorHex: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
