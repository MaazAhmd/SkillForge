
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    timestamp: Date,
    content: String,
    attachment: String
  });
  
  const ChatSessionSchema = new mongoose.Schema({
    messages: [MessageSchema],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
  module.exports = mongoose.model('ChatSession', ChatSessionSchema);
  