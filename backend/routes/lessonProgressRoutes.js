const express = require("express");

const {
  getLessonProgress,
  completeLesson,
} = require("../controllers/lessonProgressController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all completed lessons for a tool
router.get("/:toolId", protect, getLessonProgress);

// Mark a lesson as complete
router.post("/:lessonId", protect, completeLesson);

module.exports = router;