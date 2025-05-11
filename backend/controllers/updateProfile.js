const path = require("path");
const { User } = require("../models/UserModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "Profile fetched"));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, bio } = req.body;
  const updates = { name, bio: typeof bio === "string" ? JSON.parse(bio) : bio };

  if (req.file) {
    updates.profilePicture = `http://localhost:5000/uploads/images/${path.basename(req.file.path)}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
    context: "query",
  }).select("-password");

  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "Profile updated"));
});
