const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/updateProfile");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); // Import the upload middleware

// Add the upload middleware to handle profile picture uploads
router.put("/update-profile", verifyToken, upload.single("profilePic"), updateProfile);

module.exports = router;