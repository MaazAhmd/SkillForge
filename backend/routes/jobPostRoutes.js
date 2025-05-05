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
const authorizeRoles = require("../middlewares/rolesMiddleware");
const { getProposalsByJobId } = require("../controllers/proposalController");

router.get("/", getJobPosts);
router.get("/:id", getJobPostById);
router.get("/:id/proposals", verifyToken, getProposalsByJobId);
router.post("/create", verifyToken, authorizeRoles("client"), createJobPost);
router.put("/:id/update", verifyToken, authorizeRoles("client"), updateJobPost);
router.delete("/:id/delete", verifyToken, authorizeRoles("client"), deleteJobPost);

module.exports = router;
