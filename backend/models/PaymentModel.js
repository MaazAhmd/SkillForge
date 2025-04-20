const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentId: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    paymentMethod: String,
    isVerified: Boolean,
    timestamp: Date
  });
  
  module.exports = mongoose.model('Payment', PaymentSchema);