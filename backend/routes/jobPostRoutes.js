const express = require("express");
const router = express.Router();
const {
    createJobPost,
    getJobPosts,
    getJobPostById,
    updateJobPost,
    deleteJobPost,
    getAllCategories,
    getClientJobPosts,
} = require("../controllers/jobPostController");
const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rolesMiddleware");
const {
    getProposalsByJobId,
    getAppliedJobs,
} = require("../controllers/proposalController");

router.get("/", getJobPosts);
router.get(
    "/applied",
    verifyToken,
    authorizeRoles("freelancer"),
    getAppliedJobs
);
router.get("/categories", getAllCategories);
router.get("/:id", getJobPostById);
router.get("/:jobPostId/proposals", verifyToken, getProposalsByJobId);

router.get("/get/client", verifyToken, authorizeRoles("client"), getClientJobPosts);
router.post("/create", verifyToken, authorizeRoles("client"), createJobPost);
router.put("/:id/update", verifyToken, authorizeRoles("client"), updateJobPost);
router.delete(
    "/:id/delete",
    verifyToken,
    authorizeRoles("client"),
    deleteJobPost
);

module.exports = router;
