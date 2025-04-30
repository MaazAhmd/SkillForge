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

app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
