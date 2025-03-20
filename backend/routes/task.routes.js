const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
const authenticateToken = require("../utilities");

// All task routes will use the auth middleware
router.use(authenticateToken);

// Get all tasks
router.get("/", async (req, res) => {
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

// Add task
router.post("/", async (req, res) => {
    const { title, content } = req.body;
    const user = req.user;

    if (!title || !content) {
        return res.status(400).json({
            status: "error",
            error: "Invalid, all inputs are required",
        });
    }

    try {
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
router.put("/:id", async (req, res) => {
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

// Delete task
router.delete("/:id", async (req, res) => {
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

module.exports = router;
