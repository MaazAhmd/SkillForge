// socket.js
let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", ({ chatId, userId }) => {
      socket.join(chatId);
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} joined room ${chatId}`);
    });

    socket.on("sendMessage", ({ chatId, sender, content, timestamp }) => {
      console.log("Message received:", { chatId, sender, content, timestamp });
      const msg = { chatId, sender, content, timestamp: timestamp || Date.now() };

      socket.to(chatId).emit("receiveMessage", msg);

      console.log(`Message in room ${chatId} from ${sender._id

      }:`, content);
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
        }
      }
    });
  });
};

module.exports = { initSocket };
