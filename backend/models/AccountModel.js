const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    balance: Number,
});

module.exports = mongoose.model("Account", AccountSchema);
