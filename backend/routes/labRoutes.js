const express = require("express");
const router = express.Router();

const {
    getLabs,
    getLabById,
    evaluateLabAnswer,
    completeCommandObjective,
    resetLabProgress,
    createLab,
    updateLab,
    deleteLab,
} = require("../controllers/labController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ======================================================
// PUBLIC / STUDENT ROUTES
// ======================================================
router.get("/", protect, getLabs);
router.get("/:id", protect, getLabById);
router.post("/:id/evaluate", protect, evaluateLabAnswer);
router.post("/:id/complete-command", protect, completeCommandObjective);
router.post("/:id/reset", protect, resetLabProgress);

// ======================================================
// ADMIN ROUTES
// ======================================================
router.post("/", protect, adminOnly, createLab);
router.put("/:id", protect, adminOnly, updateLab);
router.delete("/:id", protect, adminOnly, deleteLab);

module.exports = router;
