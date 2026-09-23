const express = require("express");
const router = express.Router();
const {
    createInvestigation,
    getInvestigations,
    getInvestigationById,
    updateInvestigationObjectives,
    deleteInvestigation
} = require("../controllers/investigationController");
const {
    getToolSelection,
    analyzeOutput,
    mentorChat,
    getProgressiveHint,
    getNextStep,
    correlateFindings,
    getFindings,
    logStudentAction,
    getEvaluation,
    createConclusion,
    getConclusion,
    createReport,
    getReport
} = require("../controllers/investigationAiController");
const { protect } = require("../middleware/authMiddleware");

// Core investigation routes
router.route("/")
    .post(protect, createInvestigation)
    .get(protect, getInvestigations);

router.route("/:id")
    .get(protect, getInvestigationById)
    .delete(protect, deleteInvestigation);

router.route("/:id/objectives")
    .patch(protect, updateInvestigationObjectives)
    .put(protect, updateInvestigationObjectives);

// Phase 5: AI-Assisted Investigation endpoints
router.post("/:id/ai/recommend-tools", protect, getToolSelection);
router.post("/:id/ai/analyze-output", protect, analyzeOutput);
router.post("/:id/ai/mentor", protect, mentorChat);
router.post("/:id/ai/hint", protect, getProgressiveHint);
router.post("/:id/ai/next-step", protect, getNextStep);

// Phase 6: Findings & Correlation endpoints
router.post("/:id/findings/correlate", protect, correlateFindings);
router.get("/:id/findings", protect, getFindings);

// Phase 7: Student Evaluation endpoints
router.post("/:id/actions/log", protect, logStudentAction);
router.get("/:id/evaluation", protect, getEvaluation);
router.post("/:id/evaluation/evaluate", protect, getEvaluation);

module.exports = router;

// Phase 9: Conclusion and Report endpoints
router.post("/:id/conclusion", protect, createConclusion);
router.get("/:id/conclusion", protect, getConclusion);
router.post("/:id/report", protect, createReport);
router.get("/:id/report", protect, getReport);
