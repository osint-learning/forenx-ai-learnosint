const express = require("express");

const {
  getAdminOverview,
  getAdminAnalytics,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// All admin routes require login + admin role
router.use(protect);
router.use(adminMiddleware);

// Admin Dashboard
router.get("/overview", getAdminOverview);
router.get("/analytics", getAdminAnalytics);

// Student Management
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

module.exports = router;
