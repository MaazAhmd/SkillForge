const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connectDB = require("./database/db");

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const jobPostRoutes = require("./routes/jobPostRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const projectRoutes = require("./routes/projectRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const errorHandler = require("./middlewares/errorHandler");

app.use("/api/users", authRoutes);
app.use("/api/jobs", jobPostRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/portfolio',portfolioRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
