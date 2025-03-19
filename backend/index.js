const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config(); // Load environment variables

// Import models
const User = require("./models/user.model");
const Task = require("./models/task.model");

//app config
const app = express(); // create express app
const port = process.env.PORT || 3001; // port number

app.use(cors({ origin: "*" })); // Allow CORS
app.use(express.json()); //Whenever data is passed it's converted to JSON format

const jwt = require("jsonwebtoken");
const authenticateToken = require("./utilities");

// Connect to DB
mongoose
    .connect(process.env.MONGO_URI)

    //start listening to requests only when db has loaded
    .then(() => {
        // Assign port 3001
        app.listen(port, function () {
            console.log("Server is Running...");
        });

        // Create User
        app.post("/api/register", async (req, res) => {
            const { fullName, email, password } = req.body;
            if (!fullName || !email || !password) {
                return res.status(400).json({
                    status: "error",
                    error: "Invalid, all inputs are required",
                });
            }
            const isUser = await User.findOne({ email: email });
            if (isUser) {
                return res.json({
                    error: true,
                    message: "User already exists",
                });
            }

            const user = new User({
                fullName,
                email,
                password,
            });
            await user.save();

            return res.json({
                error: false,
                user,
                message: "User registered successfully",
            });
        });

        // Login User
        app.post("/api/login", async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: "error",
                    error: "Invalid, all inputs are required",
                });
            }
            const userInfo = await User.findOne({ email: email });
            if (!userInfo) {
                return res.status(400).json({
                    error: true,
                    message: "User does not exist",
                });
            }
            if (userInfo.password !== password) {
                return res.json({
                    error: true,
                    message: "Invalid Credentials",
                });
            }
            const user = { user: userInfo };
            const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: "36000m",
            });

            return res.json({
                error: false,
                message: "Login successful",
                email,
                accessToken,
            });
        });

        // Add task
        app.post("/api/tasks", authenticateToken, async (req, res) => {
            const { title, content } = req.body;
            const user = req.user;

            if (!title || !content) {
                return res.status(400).json({
                    status: "error",
                    error: "Invalid, all inputs are required",
                });
            }

            try {
                console.log("Creating Task with data:");
                console.log("Title:", title);
                console.log("Content:", content);
                console.log("User ID:", user._id);

                const task = new Task({
                    title,
                    content,
                    userId: user._id,
                });

                await task.save();

                return res.json({
                    error: false,
                    message: "Task added successfully",
                    task,
                });
            } catch (error) {
                return res.json({
                    error: true,
                    message: "Internal Server Error",
                });
            }
        });

        // Update task
        app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
            const taskId = req.params.id;
            const { title, content } = req.body;
            const user = req.user;

            if (!title || !content) {
                return res.status(400).json({
                    status: "error",
                    error: "Invalid, all inputs are required",
                });
            }

            try {
                const task = await Task.findOne({
                    _id: taskId,
                    userId: user._id,
                });

                if (!task) {
                    return res.status(404).json({
                        error: true,
                        message: "Task not found",
                    });
                }

                if (title) task.title = title;
                if (content) task.content = content;

                await task.save();

                return res.json({
                    error: false,
                    message: "Task updated successfully",
                    task,
                });
            } catch (error) {
                return res.status(500).json({
                    error: true,
                    message: "Internal Server Error",
                });
            }
        });

        // Get all tasks
        app.get("/api/tasks", authenticateToken, async (req, res) => {
            const user = req.user;

            try {
                const tasks = await Task.find({ userId: user._id });

                return res.json({
                    error: false,
                    tasks,
                });
            } catch (error) {
                return res.status(500).json({
                    error: true,
                    message: "Internal Server Error",
                });
            }
        });

        // Delete task
        app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
            const taskId = req.params.id;
            const user = req.user;

            try {
                const task = await Task.findOne({
                    _id: taskId,
                    userId: user._id,
                });

                if (!task) {
                    return res.status(404).json({
                        error: true,
                        message: "Task not found",
                    });
                }

                await Task.deleteOne({ _id: taskId, userId: user._id });

                return res.json({
                    error: false,
                    message: "Task deleted successfully",
                });
            } catch (error) {
                return res.status(500).json({
                    error: true,
                    message: "Internal Server Error",
                });
            }
        });
    })
    .catch((error) => {
        console.log(error);
    });
