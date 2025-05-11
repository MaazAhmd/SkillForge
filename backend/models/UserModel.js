const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BioSchema = new mongoose.Schema({
  about: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
});

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: { type: String, enum: ["client", "freelancer"] },
        bio: { type: BioSchema, default: () => ({}) },
        profilePicture: String,
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

const User = mongoose.model("User", UserSchema);

const FreelancerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "PortfolioItem" }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Earning" }],
    proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
FreelancerSchema.statics.findFreelancerByUserId = async function (userId) {
    return this.findOne({ user: userId });
};
const Freelancer = mongoose.model("Freelancer", FreelancerSchema);

const ClientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
ClientSchema.statics.findClientByUserId = async function (userId) {
    return this.findOne({ user: userId });
};
const Client = mongoose.model("Client", ClientSchema);

module.exports = {
    User,
    Freelancer,
    Client,
};
