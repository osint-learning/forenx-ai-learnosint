const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Investigation = require("../models/Investigation");

const DEFAULT_MISSION = {
    title: "Reconnaissance Investigation",
    description: "Analyze the reconnaissance results and identify important security-relevant findings.",
};

const DEFAULT_OBJECTIVES = [
    { title: "Analyze domain information", completed: false },
    { title: "Examine DNS records", completed: false },
    { title: "Identify technologies", completed: false },
    { title: "Examine exposed services", completed: false },
    { title: "Correlate important findings", completed: false },
];

// Helper to ensure mission & objectives exist on legacy or partial records
const formatInvestigationDoc = (doc) => {
    if (!doc) return doc;
    const item = doc.toObject ? doc.toObject() : { ...doc };

    if (!item.mission || !item.mission.title) {
        item.mission = { ...DEFAULT_MISSION };
    }

    if (!Array.isArray(item.objectives) || item.objectives.length === 0) {
        item.objectives = DEFAULT_OBJECTIVES.map(obj => ({ ...obj }));
    }

    return item;
};

// @desc    Create a new investigation from Recon results
// @route   POST /api/investigations
// @access  Private
const createInvestigation = asyncHandler(async (req, res) => {
    const { target, domain, reconData, status, mission, objectives } = req.body;

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

    const newMission = (mission && mission.title) ? mission : DEFAULT_MISSION;
    const newObjectives = (Array.isArray(objectives) && objectives.length > 0)
        ? objectives
        : DEFAULT_OBJECTIVES.map(obj => ({ ...obj }));

    const investigation = await Investigation.create({
        user: req.user._id,
        target: targetDomain,
        domain: targetDomain,
        reconData,
        status: status || "Ready for Investigation",
        mission: newMission,
        objectives: newObjectives,
    });

    res.status(201).json({
        success: true,
        message: "Investigation created successfully",
        data: formatInvestigationDoc(investigation),
    });
});

// @desc    Get all investigations for current user
// @route   GET /api/investigations
// @access  Private
const getInvestigations = asyncHandler(async (req, res) => {
    const rawInvestigations = await Investigation.find({ user: req.user._id })
        .sort({ createdAt: -1 });

    const investigations = rawInvestigations.map(formatInvestigationDoc);

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
        data: formatInvestigationDoc(investigation),
    });
});

// @desc    Update investigation objectives progress
// @route   PATCH /api/investigations/:id/objectives
// @access  Private
const updateInvestigationObjectives = asyncHandler(async (req, res) => {
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
            message: "Investigation not found or unauthorized",
        });
    }

    // Ensure objectives array is initialized
    if (!Array.isArray(investigation.objectives) || investigation.objectives.length === 0) {
        investigation.objectives = DEFAULT_OBJECTIVES.map(obj => ({ ...obj }));
    }

    const { objectives, objectiveIndex, title, completed } = req.body;

    // Case 1: Full objectives array passed
    if (Array.isArray(objectives)) {
        investigation.objectives = objectives.map((obj, idx) => ({
            title: (obj.title || (investigation.objectives[idx] && investigation.objectives[idx].title) || ("Objective " + (idx + 1))).trim(),
            completed: Boolean(obj.completed),
        }));
    }
    // Case 2: Update specific objective by index
    else if (typeof objectiveIndex === "number" && objectiveIndex >= 0 && objectiveIndex < investigation.objectives.length) {
        investigation.objectives[objectiveIndex].completed = Boolean(completed);
    }
    // Case 3: Update specific objective by title
    else if (title) {
        const found = investigation.objectives.find(
            obj => obj.title.toLowerCase().trim() === title.toLowerCase().trim()
        );
        if (found) {
            found.completed = Boolean(completed);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Objective "' + title + '" not found in this investigation',
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Provide an objectives array, objectiveIndex, or objective title with completed status",
        });
    }

    await investigation.save();

    res.json({
        success: true,
        message: "Investigation objectives updated successfully",
        data: formatInvestigationDoc(investigation),
    });
});

module.exports = {
    createInvestigation,
    getInvestigations,
    getInvestigationById,
    updateInvestigationObjectives,
};
