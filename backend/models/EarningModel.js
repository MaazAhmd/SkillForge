const mongoose = require('mongoose');
const EarningSchema = new mongoose.Schema({
    earningId: String,
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
    amount: Number,
    platformFee: Number,
    netAmount: Number,
    status: String,
    dateEarned: Date
  });
  
  module.exports = mongoose.model('Earning', EarningSchema);