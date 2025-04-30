const mongoose = require("mongoose");

const ShardTransactionSchema = new mongoose.Schema({
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer" },
    type: {
        type: String,
        enum: ["used", "refilled"],
        required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: String,
});

const ShardTransaction = mongoose.model(
    "ShardTransaction",
    ShardTransactionSchema
);
