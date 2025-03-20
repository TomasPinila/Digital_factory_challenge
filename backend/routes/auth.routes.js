const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const saltRounds = 10;

// Register route
router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({
            status: "error",
            error: "Invalid, all inputs are required",
        });
    }

    try {
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            return res.json({
                error: true,
                message: "User already exists",
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        await user.save();

        return res.json({
            error: false,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            error: true,
            message: "Server error during registration",
        });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            error: "Invalid, all inputs are required",
        });
    }

    try {
        const userInfo = await User.findOne({ email: email });
        if (!userInfo) {
            return res.status(400).json({
                error: true,
                message: "User does not exist",
            });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, userInfo.password);

        if (!isMatch) {
            return res.json({
                error: true,
                message: "Invalid Credentials",
            });
        }

        // Password matches - create token and send response
        const user = {
            user: {
                _id: userInfo._id,
                email: userInfo.email,
                fullName: userInfo.fullName,
            },
        };

        const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login successful",
            email,
            accessToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            error: true,
            message: "Server error during login",
        });
    }
});

module.exports = router;
