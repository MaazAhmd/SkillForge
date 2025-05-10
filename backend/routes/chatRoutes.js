const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, chatController.getChatsForUser);
router.post("/message", verifyToken, chatController.createChatMessage);
router.get("/users", verifyToken, chatController.getAllUsers);
router.get("/session", verifyToken, chatController.getOrCreateChat);
router.get('/:chatId',verifyToken, chatController.getChatById);
module.exports = router;
