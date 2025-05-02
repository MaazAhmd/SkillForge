const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        status: {
            type: String,
            enum: ["pending", "escrow", "completed", "refunded"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
