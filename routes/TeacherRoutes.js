const express = require("express");
const router = express.Router();
const {
  addMark,
  getMyStudentsMarks,
  updateMark,
  deleteMark,
  getMyStudents
} = require("../controllers/TeacherController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.use(verifyToken, authorizeRoles("teacher"));

router.post("/marks", addMark);
router.get("/marks", getMyStudentsMarks);
router.put("/marks/:id", updateMark);
router.delete("/marks/:id", deleteMark);
router.get("/students", getMyStudents);
module.exports = router;