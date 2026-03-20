const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  groupId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  sender: { type: String, required: true },
  time: { type: String, required: true },
  isFile: { type: Boolean, default: false },
  fileData: {
    id: Number,
    name: String,
    size: String,
    type: String,
    url: String,
    time: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);