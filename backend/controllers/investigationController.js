const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Investigation = require("../models/Investigation");

// @desc    Create a new investigation from Recon results
// @route   POST /api/investigations
// @access  Private
const createInvestigation = asyncHandler(async (req, res) => {
    const { target, domain, reconData, status } = req.body;

    const targetDomain = (target || domain || "").trim();

    if (!targetDomain) {
        return res.status(400).json({
            success: false,
            message: "Target or domain is required",
        });
    }

    if (!reconData || typeof reconData !== "object" || Object.keys(reconData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Recon data is required",
        });
    }

    const investigation = await Investigation.create({
        user: req.user._id,
        target: targetDomain,
        domain: targetDomain,
        reconData,
        status: status || "Ready for Investigation",
    });

    res.status(201).json({
        success: true,
        message: "Investigation created successfully",
        data: investigation,
    });
});

// @desc    Get all investigations for current user
// @route   GET /api/investigations
// @access  Private
const getInvestigations = asyncHandler(async (req, res) => {
    const investigations = await Investigation.find({ user: req.user._id })
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: investigations.length,
        data: investigations,
    });
});

// @desc    Get single investigation by ID for current user
// @route   GET /api/investigations/:id
// @access  Private
const getInvestigationById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid investigation ID",
        });
    }

    const investigation = await Investigation.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!investigation) {
        return res.status(404).json({
            success: false,
            message: "Investigation not found",
        });
    }

    res.json({
        success: true,
        data: investigation,
    });
});

module.exports = {
    createInvestigation,
    getInvestigations,
    getInvestigationById,
};
