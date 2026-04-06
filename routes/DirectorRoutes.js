const express = require("express");
const router = express.Router();
const {
  createTeacher,
  createStudent,
  getAllTeachers,
  getAllStudents,
  getTeacherById,
  getStudentById,
  updateTeacher,
  updateStudent,
  deleteTeacher,
  deleteStudent
} = require("../controllers/DirectorController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(verifyToken, authorizeRoles("director"));

router.post("/teachers", createTeacher);
router.post("/students", createStudent);

router.get("/teachers", getAllTeachers);
router.get("/students", getAllStudents);

router.get("/teachers/:id", getTeacherById);
router.get("/students/:id", getStudentById);

router.put("/teachers/:id", updateTeacher);
router.put("/students/:id", updateStudent);

router.delete("/teachers/:id", deleteTeacher);
router.delete("/students/:id", deleteStudent);

module.exports = router;