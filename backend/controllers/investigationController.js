const asyncHandler = require("express-async-handler");
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

module.exports = {
    createInvestigation,
};
