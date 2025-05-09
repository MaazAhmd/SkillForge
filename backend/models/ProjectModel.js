const mongoose = require("mongoose");

// Project is the same thing as Job
const ProjectSchema = new mongoose.Schema(
    {
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
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
                "in-revision",
                "completed-not-reviewed",
                "completed-reviewed",
                "cancelled",
            ],
            default: "in-process",
        },
        completionDate: Date,
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
        deliveries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Delivery",
            },
        ],
    },
    { timestamps: true }
);
const Project = mongoose.model("Project", ProjectSchema);

module.exports = {Project};
