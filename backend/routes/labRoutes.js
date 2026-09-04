const express = require("express");

const router = express.Router();

const {
    getLabs,
    getLabById,
    evaluateLabAnswer,
    resetLabProgress,
} = require("../controllers/labController");

const { protect } = require("../middleware/authMiddleware");


// ======================================================
// GET ALL ACTIVE LABS
// ======================================================

router.get("/", protect, getLabs);


// ======================================================
// GET ONE LAB
// ======================================================

router.get("/:id", protect, getLabById);


// ======================================================
// EVALUATE OBJECTIVE ANSWER
// ======================================================

router.post(
    "/:id/evaluate",
    protect,
    evaluateLabAnswer
);


// ======================================================
// RETRY / RESET LAB
// ======================================================

router.post(
    "/:id/reset",
    protect,
    resetLabProgress
);


module.exports = router;