const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Investigation = require("../models/Investigation");
const aiService = require("../services/ai/investigationAiService");

// Helper to fetch investigation and verify user ownership
const getOwnedInvestigation = async (id, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Investigation.findOne({ _id: id, user: userId });
};

// @desc    Recommend tools based on real recon findings
// @route   POST /api/investigations/:id/ai/recommend-tools
// @access  Private
const getToolSelection = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const recommendations = await aiService.recommendTools(investigation);
    res.json({
        success: true,
        target: investigation.target,
        recommendations,
    });
});

// @desc    Explain specific recon output section
// @route   POST /api/investigations/:id/ai/analyze-output
// @access  Private
const analyzeOutput = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const { section, query } = req.body;
    const analysis = await aiService.analyzeReconSection(investigation, section, query);
    res.json({
        success: true,
        target: investigation.target,
        analysis,
    });
});

// @desc    AI Mentor investigation chat
// @route   POST /api/investigations/:id/ai/mentor
// @access  Private
const mentorChat = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: "Message is required" });
    }

    const reply = await aiService.chatWithMentor(investigation, message, investigation.aiChatHistory);

    // Persist chat message in investigation
    investigation.aiChatHistory.push({ role: 'user', message, timestamp: new Date() });
    investigation.aiChatHistory.push({ role: 'assistant', message: reply, timestamp: new Date() });
    await investigation.save();

    res.json({
        success: true,
        reply,
        chatHistory: investigation.aiChatHistory,
    });
});

// @desc    Get progressive hint
// @route   POST /api/investigations/:id/ai/hint
// @access  Private
const getProgressiveHint = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const { level = 1 } = req.body;
    const hintData = await aiService.generateProgressiveHint(investigation, level);

    // Record unlocked hint if not already present
    const existing = (investigation.unlockedHints || []).find(h => h.level === Number(hintData.level));
    if (!existing) {
        investigation.unlockedHints.push({
            level: hintData.level,
            hint: hintData.hint,
            guidance: hintData.guidance,
            nextStep: hintData.nextStep,
            unlockedAt: new Date()
        });
        await investigation.save();
    }

    res.json({
        success: true,
        hint: hintData,
        unlockedHints: investigation.unlockedHints,
    });
});

// @desc    Recommend next investigation step
// @route   POST /api/investigations/:id/ai/next-step
// @access  Private
const getNextStep = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const nextStep = await aiService.recommendNextStep(investigation);
    res.json({
        success: true,
        target: investigation.target,
        nextStep,
    });
});

// @desc    Generate and persist correlated findings
// @route   POST /api/investigations/:id/findings/correlate
// @access  Private
const correlateFindings = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const findings = await aiService.correlateInvestigationFindings(investigation);
    investigation.findings = findings;

    // Also update evaluation after correlation
    const evaluation = aiService.evaluateStudentProgress(investigation);
    investigation.evaluation = evaluation;

    await investigation.save();

    res.json({
        success: true,
        message: "Findings correlated and saved successfully",
        count: findings.length,
        findings: investigation.findings,
        evaluation: investigation.evaluation,
    });
});

// @desc    Get current findings
// @route   GET /api/investigations/:id/findings
// @access  Private
const getFindings = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    // If findings empty, auto-generate initial findings
    if (!investigation.findings || investigation.findings.length === 0) {
        const findings = await aiService.correlateInvestigationFindings(investigation);
        investigation.findings = findings;
        await investigation.save();
    }

    res.json({
        success: true,
        count: investigation.findings.length,
        findings: investigation.findings,
    });
});

// @desc    Log a student investigation action and update evaluation
// @route   POST /api/investigations/:id/actions/log
// @access  Private
const logStudentAction = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const { actionType, description, targetItem } = req.body;
    if (!actionType || !description) {
        return res.status(400).json({ success: false, message: "actionType and description are required" });
    }

    investigation.studentActions.push({
        actionType,
        description,
        targetItem: targetItem || "",
        timestamp: new Date()
    });

    const evaluation = aiService.evaluateStudentProgress(investigation);
    investigation.evaluation = evaluation;

    await investigation.save();

    res.json({
        success: true,
        message: "Action logged and evaluation updated",
        studentActions: investigation.studentActions,
        evaluation: investigation.evaluation,
    });
});

// @desc    Get student evaluation
// @route   GET /api/investigations/:id/evaluation
// @access  Private
const getEvaluation = asyncHandler(async (req, res) => {
    const investigation = await getOwnedInvestigation(req.params.id, req.user._id);
    if (!investigation) {
        return res.status(404).json({ success: false, message: "Investigation not found or unauthorized" });
    }

    const evaluation = aiService.evaluateStudentProgress(investigation);
    investigation.evaluation = evaluation;
    await investigation.save();

    res.json({
        success: true,
        evaluation: investigation.evaluation,
        studentActionsCount: (investigation.studentActions || []).length,
    });
});

module.exports = {
    getToolSelection,
    analyzeOutput,
    mentorChat,
    getProgressiveHint,
    getNextStep,
    correlateFindings,
    getFindings,
    logStudentAction,
    getEvaluation,
};
