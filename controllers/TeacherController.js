const Mark = require("../models/MarkModel");
const User = require("../models/UserModel");

exports.addMark = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId, term, academicYear, marks } = req.body;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ message: "Not a teacher" });
    }

    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔒 RULE: same class
    if (teacher.className !== student.className) {
      return res.status(403).json({ message: "Student not in your class" });
    }

    // 🔒 RULE: marks range
    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: "Marks must be between 0 and 100" });
    }

    const newMark = await Mark.create({
      student: studentId,
      teacher: teacherId,
      subject: teacher.subject,
      className: teacher.className,
      term,
      academicYear,
      marks
    });

    return res.status(201).json({
      message: "Mark added successfully",
      mark: newMark
    });
  } catch (error) {
    console.error("Add mark error:", error);

    // duplicate error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Mark already exists for this student, subject, and term"
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMyStudentsMarks = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await User.findById(teacherId);

    const marks = await Mark.find({
      teacher: teacherId
    })
      .populate("student", "fullName studentCode className")
      .select("-__v");

    return res.status(200).json(marks);
  } catch (error) {
    console.error("Get marks error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateMark = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { marks } = req.body;

    const mark = await Mark.findById(req.params.id);

    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    if (mark.teacher.toString() !== teacherId) {
      return res.status(403).json({ message: "Not your mark" });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({ message: "Marks must be between 0 and 100" });
    }

    mark.marks = marks;

    await mark.save();

    return res.status(200).json({
      message: "Mark updated successfully",
      mark
    });
  } catch (error) {
    console.error("Update mark error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteMark = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const mark = await Mark.findById(req.params.id);

    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    if (mark.teacher.toString() !== teacherId) {
      return res.status(403).json({ message: "Not your mark" });
    }

    await mark.deleteOne();

    return res.status(200).json({
      message: "Mark deleted successfully"
    });
  } catch (error) {
    console.error("Delete mark error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ message: "Not a teacher" });
    }

    const students = await User.find({
      role: "student",
      className: teacher.className
    }).select("fullName studentCode className");

    return res.status(200).json(students);
  } catch (error) {
    console.error("Get my students error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};