const mongoose = require("mongoose");

const EarningSchema = new mongoose.Schema({
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    amount: Number,
    dateEarned: Date,
});

module.exports = mongoose.model("Earning", EarningSchema);
