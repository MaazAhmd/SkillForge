const mongoose = require("mongoose");

const JobPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        budget: Number,
        deadline: Date,
        status: {
            type: String,
            enum: ["open", "assigned", "cancelled", "completed"],
            default: "open",
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        category: String,
        skills: [String],
        proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
    },
    { timestamps: true }
);

const JobPost = mongoose.model("JobPost", JobPostSchema);

module.exports = {
    JobPost,
};
