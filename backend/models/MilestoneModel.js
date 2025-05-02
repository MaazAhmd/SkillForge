const mongoose = require("mongoose");

// Currently not used in the application, but can be used for future reference
const MilestoneSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost" },
    title: String,
    description: String,
    amount: Number,
    dueDate: Date,
    isCompleted: Boolean,
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
});

module.exports = mongoose.model("Milestone", MilestoneSchema);
