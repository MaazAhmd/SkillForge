const express = require("express");
const router = express.Router();
const { updateProfile, getUserProfile } = require("../controllers/updateProfile");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); 

router.put("/update-profile", verifyToken, upload.single("profilePicture"), updateProfile);
router.get("/me", verifyToken, getUserProfile);

module.exports = router;