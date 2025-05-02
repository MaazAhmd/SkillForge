const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
        },
        rating: Number,
        comment: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
