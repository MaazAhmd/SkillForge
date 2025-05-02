const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { User } = require("../models/UserModel");

const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "No access token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?._id).select(
        "-password -createdAt -updatedAt"
    );
    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
});

module.exports = { verifyToken };
