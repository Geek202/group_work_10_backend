const Mark = require("../models/MarkModel");
const User = require("../models/UserModel");

const getGrade = (avg) => {
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
};

const getRemark = (avg) => {
  if (avg >= 80) return "Excellent";
  if (avg >= 70) return "Very Good";
  if (avg >= 60) return "Good";
  if (avg >= 50) return "Pass";
  return "Fail";
};

exports.generateReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { term, academicYear } = req.query;

    if (!term || !academicYear) {
      return res.status(400).json({
        message: "Term and academicYear are required"
      });
    }

    const requester = await User.findById(req.user.id);

    if (!requester) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // ACCESS CONTROL
    if (requester.role === "student") {
      if (requester._id.toString() !== studentId) {
        return res.status(403).json({
          message: "You can only view your own report"
        });
      }
    }

    if (requester.role === "teacher") {
      if (requester.className !== student.className) {
        return res.status(403).json({
          message: "You can only view reports of students in your class"
        });
      }
    }

    if (!["director", "teacher", "student"].includes(requester.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const studentMarks = await Mark.find({
      student: studentId,
      term,
      academicYear
    });

    if (studentMarks.length === 0) {
      return res.status(404).json({ message: "No marks found for this term" });
    }

    let total = 0;

    const subjects = studentMarks.map((m) => {
      total += m.marks;
      return {
        subject: m.subject,
        marks: m.marks
      };
    });

    const average = total / studentMarks.length;

    const classStudents = await User.find({
      role: "student",
      className: student.className
    });

    const rankings = [];

    for (const s of classStudents) {
      const marks = await Mark.find({
        student: s._id,
        term,
        academicYear
      });

      if (marks.length === 0) continue;

      let totalMarks = 0;

      marks.forEach((m) => {
        totalMarks += m.marks;
      });

      const avg = totalMarks / marks.length;

      rankings.push({
        studentId: s._id.toString(),
        average: avg
      });
    }

    rankings.sort((a, b) => b.average - a.average);

    const position =
      rankings.findIndex((r) => r.studentId === studentId) + 1;

    return res.status(200).json({
      student: student.fullName,
      studentId: student._id,
      studentCode: student.studentCode,
      class: student.className,
      term,
      academicYear,
      subjects,
      total,
      average: Number(average.toFixed(2)),
      grade: getGrade(average),
      remark: getRemark(average),
      position,
      totalStudents: rankings.length
    });
  } catch (error) {
    console.error("Report error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
