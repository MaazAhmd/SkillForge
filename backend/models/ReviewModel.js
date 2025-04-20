const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    reviewId: String,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    rating: Number,
    comment: String,
    createdAt: Date
  });
  
  module.exports = mongoose.model('Review', ReviewSchema);