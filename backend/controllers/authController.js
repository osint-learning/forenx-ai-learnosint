const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register
const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields",
        });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            xp: user.xp,
            level: user.level,
        },
    });
});

// Login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    res.json({
        success: true,
        token: generateToken(user._id),
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            xp: user.xp,
            level: user.level,
        },
    });
});

// Profile
const profile = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

module.exports = {
    register,
    login,
    profile,
};