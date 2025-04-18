
const JobPostSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  deadline: Date,
  status: {
    type: String,
    enum: ['open', 'assigned', 'conflict', 'cancelled', 'completed'],
    default: 'open'
  },  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  category: String,
  milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }]
});
const JobPost = mongoose.model('JobPost', JobPostSchema);

const ProposalSchema = new mongoose.Schema({
  proposalId: String,
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' },
  message: String,
  proposedPrice: Number,
  submittedAt: Date,
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'],
    default: 'submitted'
  }
});
const Proposal = mongoose.model('Proposal', ProposalSchema);

module.exports = {
  JobPost,
  Proposal
};
