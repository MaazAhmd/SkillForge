const express = require("express");
const {
    getProjects,
    getProjectsById,
    updateDeadline,
    deliverProject,
    requestRevision,
    markCompleted,
} = require("../controllers/projectController");
const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rolesMiddleware");

const router = express.Router();

router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProjectsById);
router.post("/:id/deliver", verifyToken, authorizeRoles('freelancer'), deliverProject);
router.put("/:id/update-deadline", verifyToken, authorizeRoles('client'), updateDeadline);
router.put("/:id/mark-complete", verifyToken, authorizeRoles('client'), markCompleted);
router.put("/:id/request-revision", verifyToken, authorizeRoles('client'), requestRevision);

module.exports = router;
