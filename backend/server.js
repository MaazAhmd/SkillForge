const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const path = require("path");
const connectDB = require("./database/db");
const { initSocket } = require("./utils/socket");

const app = express();
const server = http.createServer(app); 

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const jobPostRoutes = require("./routes/jobPostRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const projectRoutes = require("./routes/projectRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const chatRoutes = require("./routes/chatRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const accountRoutes = require("./routes/accountRoutes");
const updateProfileRoutes = require("./routes/updateProfileRoute"); // Import the update profile routes
const errorHandler = require("./middlewares/errorHandler");

app.use("/api/users", authRoutes);
app.use("/api/users", updateProfileRoutes); 
app.use("/api/jobs", jobPostRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/chat", chatRoutes);
app.use("/download", downloadRoutes);

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "uploads", "files"))
);

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/accounts", accountRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
