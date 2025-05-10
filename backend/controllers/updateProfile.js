const { User } = require("../models/UserModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("express-async-handler"); // Correct import

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

module.exports = { updateProfile };