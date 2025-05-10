const { User } = require("../models/UserModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("express-async-handler"); // Correct import

// Update Profile Function
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, email, phone, description, location } = req.body;

    const updates = { name, email, phone, description, location };

    // Handle profile picture upload if provided
    if (req.file) {
        updates.profilePicture = req.file.path; // Assuming you're using multer for file uploads
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

// Get User Profile Function
const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user; // The user object is already attached by verifyToken middleware
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

module.exports = { updateProfile, getUserProfile };