const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  recieverId: {
    type: String,
    required: true,
  },
  createAt: {
    type: String,
    default: Timestamp,
  },
  msgSender: {
    type: String,
    default: senderId,
  },
});
module.exports = mongoose.model("Chat", chatSchema);
