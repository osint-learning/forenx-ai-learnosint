const LessonProgress = require("../models/LessonProgress");
const LabProgress = require("../models/LabProgress");
const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const Tool = require("../models/Tool");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Lab = require("../models/Lab");

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



// ==========================================
// ADMIN DASHBOARD ANALYTICS
// ==========================================

const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    verifiedStudents,
    students,
    totalLessonsCompleted,
    totalLabsCompleted,
    tools,
    lessons,
    quizzes,
    labs,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "student", isVerified: true }),
    User.find({ role: "student" }).select("fullName email xp level isVerified createdAt"),
    LessonProgress.countDocuments({ completed: true }),
    LabProgress.countDocuments({ completed: true }),
    Tool.find().select("name category difficulty"),
    Lesson.find().select("title tool difficulty lessonNumber"),
    Quiz.find().select("question tool difficulty"),
    Lab.find().select("title tool difficulty category"),
  ]);

  const totalXp = students.reduce((sum, s) => sum + (s.xp || 0), 0);
  const avgXp = totalStudents > 0 ? Math.round(totalXp / totalStudents) : 0;
  
  const levelDistribution = {
    level1: students.filter((s) => (s.level || 1) === 1).length,
    level2: students.filter((s) => s.level === 2).length,
    level3: students.filter((s) => s.level === 3).length,
    level4: students.filter((s) => s.level === 4).length,
    level5Plus: students.filter((s) => (s.level || 1) >= 5).length,
  };

  const topStudents = [...students]
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 5)
    .map((s) => ({
      _id: s._id,
      fullName: s.fullName,
      email: s.email,
      xp: s.xp,
      level: s.level,
      isVerified: s.isVerified,
    }));

  const toolsByCategory = {};
  tools.forEach((t) => {
    toolsByCategory[t.category] = (toolsByCategory[t.category] || 0) + 1;
  });

  const contentByDifficulty = {
    beginner: lessons.filter((l) => l.difficulty === "Beginner").length + tools.filter((t) => t.difficulty === "Beginner").length,
    intermediate: lessons.filter((l) => l.difficulty === "Intermediate").length + tools.filter((t) => t.difficulty === "Intermediate").length,
    advanced: lessons.filter((l) => l.difficulty === "Advanced").length + tools.filter((t) => t.difficulty === "Advanced").length,
  };

  res.json({
    success: true,
    data: {
      students: {
        total: totalStudents,
        verified: verifiedStudents,
        unverified: totalStudents - verifiedStudents,
        totalXp,
        avgXp,
        levelDistribution,
        topStudents,
      },
      content: {
        totalTools: tools.length,
        totalLessons: lessons.length,
        totalQuizzes: quizzes.length,
        totalLabs: labs.length,
        toolsByCategory,
        contentByDifficulty,
      },
      engagement: {
        totalLessonsCompleted,
        totalLabsCompleted,
      },
    },
  });
});

module.exports = {
  getAdminOverview,
  getAdminAnalytics,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
