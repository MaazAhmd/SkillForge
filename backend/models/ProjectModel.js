const mongoose = require("mongoose");

// Project is the same thing as Job
const ProjectSchema = new mongoose.Schema(
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
        proposalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal",
            required: true,
        },
        deadline: { type: Date, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: [
                "in-process",
                "delivered",
                "completed-not-reviewed",
                "completed-reviewed",
                "cancelled",
            ],
            default: "submitted",
        },
        completionDate: Date,
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },
    },
    { timestamps: true }
);
const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
