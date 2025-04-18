const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['client', 'freelancer'] },
  bio: String,
  profilePicture: String,
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});
const User = mongoose.model('User', UserSchema);

const FreelancerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioItem' }],
  skills: [{ type: String }],
  earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Earning' }],
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }]
});
const Freelancer = mongoose.model('Freelancer', FreelancerSchema);

const ClientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }]
});
const Client = mongoose.model('Client', ClientSchema);

module.exports = {
  User,
  Freelancer,
  Client
};
