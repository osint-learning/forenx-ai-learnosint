const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const Tool = require("../models/Tool");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Lab = require("../models/Lab");
const Investigation = require("../models/Investigation");

// ==========================================
// ADMIN DASHBOARD OVERVIEW
// ==========================================

const getAdminOverview = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalAdmins,
    totalUsers,
    totalTools,
    totalLessons,
    totalQuizzes,
    totalLabs,
    totalInvestigations,
    verifiedStudents,
    recentStudents,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments(),

    Tool.countDocuments(),
    Lesson.countDocuments(),
    Quiz.countDocuments(),
    Lab.countDocuments(),
    Investigation.countDocuments(),

    User.countDocuments({
      role: "student",
      isVerified: true,
    }),

    User.find({ role: "student" })
      .select("fullName email role xp level isVerified createdAt")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        students: totalStudents,
        admins: totalAdmins,
        verifiedStudents,
      },

      learning: {
        tools: totalTools,
        lessons: totalLessons,
        quizzes: totalQuizzes,
        labs: totalLabs,
      },

      investigations: {
        total: totalInvestigations,
      },

      recentStudents,
    },
  });
});


// ==========================================
// GET ALL STUDENTS
// ==========================================

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: students.length,
    data: students,
  });
});


// ==========================================
// GET SINGLE STUDENT
// ==========================================

const getStudentById = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  })
    .select("-password")
    .populate("completedLessons", "title lessonNumber")
    .populate("completedLabs", "title difficulty");

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  res.json({
    success: true,
    data: student,
  });
});


// ==========================================
// UPDATE STUDENT
// ==========================================

const updateStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  const allowedFields = [
    "fullName",
    "email",
    "xp",
    "level",
    "isVerified",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });

  await student.save();

  res.json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});


// ==========================================
// DELETE STUDENT
// ==========================================

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: "student",
  });

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  await student.deleteOne();

  res.json({
    success: true,
    message: "Student deleted successfully",
  });
});


module.exports = {
  getAdminOverview,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};