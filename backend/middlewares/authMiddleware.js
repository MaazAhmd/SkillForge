const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { User } = require("../models/UserModel");

const verifyToken = asyncHandler(async (req, res, next) => {
    try {
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
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        } else if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid access token");
        } else {
            throw new ApiError(400, "Something is wrong with Token");
        }
    }
});

module.exports = { verifyToken };
