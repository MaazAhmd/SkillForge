const express = require("express");
const router = express.Router();
const {
    createJobPost,
    getJobPosts,
    getJobPostById,
    updateJobPost,
    deleteJobPost,
} = require("../controllers/jobPostController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/get-all", getJobPosts);
router.get("/get/:id", getJobPostById);
router.post("/create", [verifyToken, createJobPost]);
router.put("/update/:id", [verifyToken, updateJobPost]);
router.delete("/delete/:id", [verifyToken, deleteJobPost]);

module.exports = router;
