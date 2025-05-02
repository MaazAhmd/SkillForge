const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema(
    {
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true,
        },
        jobPostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobPost",
            required: true,
        },
        message: { type: String, required: true },
        deadline: { type: Date, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ["submitted", "accepted", "rejected", "withdrawn"],
            default: "submitted",
        },
    },
    { timestamps: true }
);
const Proposal = mongoose.model("Proposal", ProposalSchema);

module.exports = Proposal;
