const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Account } = require("../models/AccountModel");

const getAccountByUserId = asyncHandler(async (req, res) => {
    const account = await Account.getAccountByUserId(req.user._id);
    if (!account) {
        throw new ApiError(404, "Account not found for this user");
    }

    res.status(200).json(
        new ApiResponse(200, account, "Account retrieved successfully")
    );
});

// These controller functions not finalized yet:
const addFunds = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        throw new ApiError(400, "Valid amount is required");
    }

    const account = await Account.findById(accountId);
    if (!account) {
        throw new ApiError(404, "Account not found");
    }

    await account.addFunds(Number(amount));
    res.status(200).json(
        new ApiResponse(200, account, "Funds added successfully")
    );
});

const withdrawFunds = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        throw new ApiError(400, "Valid amount is required");
    }

    const account = await Account.findById(accountId);
    if (!account) {
        throw new ApiError(404, "Account not found");
    }

    await account.withdrawFunds(Number(amount));
    res.status(200).json(
        new ApiResponse(200, account, "Funds withdrawn successfully")
    );
});

const sendFunds = asyncHandler(async (req, res) => {
    const { senderId, recipientId } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        throw new ApiError(400, "Valid amount is required");
    }

    const sender = await Account.findById(senderId);
    const recipient = await Account.findById(recipientId);

    if (!sender || !recipient) {
        throw new ApiError(404, "Sender or recipient account not found");
    }

    await sender.sendFunds(Number(amount), recipient);

    res.status(200).json(
        new ApiResponse(
            200,
            { sender, recipient },
            "Funds transferred successfully"
        )
    );
});

module.exports = {
    getAccountByUserId,
    addFunds,
    withdrawFunds,
    sendFunds,
};
