const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/user", verifyToken, accountController.getAccountByUserId);

// Not finalized:
router.post("/:accountId/add", verifyToken, accountController.addFunds);
router.post("/:accountId/withdraw", verifyToken, accountController.withdrawFunds);
router.post("/:senderId/send/:recipientId", verifyToken, accountController.sendFunds);

module.exports = router;
