const asyncHandler = require("express-async-handler");

const LessonProgress = require("../models/LessonProgress");

// =====================================
// GET Progress for a Tool
// GET /api/lesson-progress/:toolId
// =====================================

const getLessonProgress = asyncHandler(async (req, res) => {
  const progress = await LessonProgress.find({
    user: req.user._id,
    tool: req.params.toolId,
  });

  res.json({
    success: true,
    data: progress,
  });
});

// =====================================
// Mark Lesson Complete
// POST /api/lesson-progress/:lessonId
// =====================================

const completeLesson = asyncHandler(async (req, res) => {
  const progress = await LessonProgress.findOneAndUpdate(
    {
      user: req.user._id,
      lesson: req.params.lessonId,
    },
    {
      user: req.user._id,
      tool: req.body.toolId,
      lesson: req.params.lessonId,
      completed: true,
      completedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.json({
    success: true,
    message: "Lesson marked as completed.",
    data: progress,
  });
});

module.exports = {
  getLessonProgress,
  completeLesson,
};