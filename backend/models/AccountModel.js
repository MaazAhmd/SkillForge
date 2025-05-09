const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    balance: Number,
});

AccountSchema.methods.addFunds = function (amount) {
    this.balance += amount;
    return this.save();
};
AccountSchema.methods.withdrawFunds = function (amount) {
    if (this.balance < amount) {
        throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    return this.save();
};
AccountSchema.methods.sendFunds = function (amount, recipientAccount) {
    if (this.balance < amount) {
        throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    recipientAccount.balance += amount;
    return Promise.all([this.save(), recipientAccount.save()]);
};
AccountSchema.statics.getAccountByUserId = function (userId) {
    return this.findOne({ userId }).populate("userId");
};

const Account = mongoose.model("Account", AccountSchema);
module.exports = { Account };
