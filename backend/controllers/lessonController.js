const asyncHandler = require("express-async-handler");

const Lesson = require("../models/Lesson");

// =====================================
// Get All Lessons
// GET /api/lessons
// =====================================

const getAllLessons = asyncHandler(async (req, res) => {

    const lessons = await Lesson.find()
        .populate("tool", "name category")
        .sort({ lessonNumber: 1 });

    res.json({
        success: true,
        count: lessons.length,
        data: lessons,
    });

});

// =====================================
// Get Lesson By ID
// GET /api/lessons/:id
// =====================================

const getLessonById = asyncHandler(async (req, res) => {

    const lesson = await Lesson.findById(req.params.id)
        .populate("tool", "name category");

    if (!lesson) {
        return res.status(404).json({
            success: false,
            message: "Lesson not found",
        });
    }

    res.json({
        success: true,
        data: lesson,
    });

});

// =====================================
// Get Lessons By Tool
// GET /api/lessons/tool/:toolId
// =====================================

const getLessonsByTool = asyncHandler(async (req, res) => {

    const lessons = await Lesson.find({
        tool: req.params.toolId,
    }).sort({ lessonNumber: 1 });

    res.json({
        success: true,
        count: lessons.length,
        data: lessons,
    });

});

// =====================================
// Create Lesson
// POST /api/lessons
// =====================================

const createLesson = asyncHandler(async (req, res) => {

    const lesson = await Lesson.create(req.body);

    res.status(201).json({
        success: true,
        message: "Lesson created successfully",
        data: lesson,
    });

});

// =====================================
// Update Lesson
// PUT /api/lessons/:id
// =====================================

const updateLesson = asyncHandler(async (req, res) => {

    const lesson = await Lesson.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
            new: true,
            runValidators: true,
        }

    );

    if (!lesson) {

        return res.status(404).json({

            success: false,

            message: "Lesson not found",

        });

    }

    res.json({

        success: true,

        message: "Lesson updated successfully",

        data: lesson,

    });

});

// =====================================
// Delete Lesson
// DELETE /api/lessons/:id
// =====================================

const deleteLesson = asyncHandler(async (req, res) => {

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {

        return res.status(404).json({

            success: false,

            message: "Lesson not found",

        });

    }

    await lesson.deleteOne();

    res.json({

        success: true,

        message: "Lesson deleted successfully",

    });

});

module.exports = {

    getAllLessons,

    getLessonById,

    getLessonsByTool,

    createLesson,

    updateLesson,

    deleteLesson,

};