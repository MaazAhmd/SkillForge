const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:    String,
  attachment: {
    url: String,
    name: String
  },
    timestamp:  { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [MessageSchema],
}, { timestamps: true });

ChatSessionSchema.index(
  { user1: 1, user2: 1 },
  { unique: true, partialFilterExpression: { user1: { $exists: true }, user2: { $exists: true } } }
);

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
