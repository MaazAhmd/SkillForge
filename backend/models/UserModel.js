const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        bio: String,
        profilePicture: String,
        ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
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

const User = mongoose.model("User", UserSchema);

const FreelancerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "PortfolioItem" }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Earning" }],
    proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],

    shardBalance: { type: Number, default: 50 },
    shardHistory: [
        { type: mongoose.Schema.Types.ObjectId, ref: "ShardTransaction" },
    ],
});
const Freelancer = mongoose.model("Freelancer", FreelancerSchema);

const ClientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
});
const Client = mongoose.model("Client", ClientSchema);

module.exports = {
    User,
    Freelancer,
    Client,
};
