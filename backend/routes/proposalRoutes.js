const express = require("express");
const {
    getProposals,
    getProposalById,
    createProposal,
    updateProposal,
    deleteProposal,
    acceptProposal,
    getProposalsByJobId,
} = require("../controllers/proposalController");
const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rolesMiddleware");

const router = express.Router();

// Common routes
router.get("/", verifyToken, getProposals);
router.get("/:id", verifyToken, getProposalById);
router.get("/get-job-proposals/:jobPostId", verifyToken, getProposalsByJobId);

// Freelancer routes
router.post("/create", verifyToken, authorizeRoles('freelancer'), createProposal);
router.get("/:id", verifyToken, authorizeRoles('freelancer'), getProposalById);
router.put("/:id/update", verifyToken, authorizeRoles('freelancer'), updateProposal);
router.delete("/:id/delete", verifyToken, authorizeRoles('freelancer'), deleteProposal);

// Client routes
router.put("/:id/accept", verifyToken, authorizeRoles('client'), acceptProposal);

module.exports = router;
