const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", verifyToken, chatController.getChatsForUser);

router.post(
  "/message",
  verifyToken,
  upload.single("attachment"),
  chatController.createChatMessage
);
router.get("/users", verifyToken, chatController.getAllUsers);
  router.get("/session", verifyToken, chatController.getOrCreateChat);
  router.get("/conversations", verifyToken,chatController.getUserConversations);
router.get('/:chatId',verifyToken, chatController.getChatById);
module.exports = router;
