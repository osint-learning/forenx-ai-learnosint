const express = require("express");

const {

    getAllLessons,

    getLessonById,

    getLessonsByTool,

    createLesson,

    updateLesson,

    deleteLesson,

} = require("../controllers/lessonController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes

router.get("/", getAllLessons);

router.get("/tool/:toolId", getLessonsByTool);

router.get("/:id", getLessonById);

// Admin Routes

router.post("/", protect, adminOnly, createLesson);

router.put("/:id", protect, adminOnly, updateLesson);

router.delete("/:id", protect, adminOnly, deleteLesson);

module.exports = router;