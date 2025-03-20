const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

// App config
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    });

// Use routes
app.use("/api", authRoutes); // Routes will be /api/login and /api/register
app.use("/api/tasks", taskRoutes); // Routes will be /api/tasks, /api/tasks/:id, etc.

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
