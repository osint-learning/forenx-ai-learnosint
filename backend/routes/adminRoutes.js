const express = require("express");

const {
  getAdminOverview,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard
router.get("/overview", getAdminOverview);

// Student management
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

module.exports = router;