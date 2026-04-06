const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");



exports.createTeacher = async (req, res) => {
  try {
    const { fullName, email, password, subject, className, teacherCode } = req.body;

    const errors = [];
    if (!fullName) errors.push("Full name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (!subject) errors.push("Subject is required");
    if (!className) errors.push("Class name is required");
    if (!teacherCode) errors.push("Teacher code is required");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingTeacherCode = await User.findOne({ teacherCode });
    if (existingTeacherCode) {
      return res.status(400).json({ message: "Teacher code already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "teacher",
      subject,
      className,
      teacherCode
    });

    return res.status(201).json({
      message: "Teacher created successfully",
      teacher: {
        id: teacher._id,
        fullName: teacher.fullName,
        email: teacher.email,
        role: teacher.role,
        subject: teacher.subject,
        className: teacher.className,
        teacherCode: teacher.teacherCode
      }
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { fullName, email, password, className, studentCode } = req.body;

    const errors = [];
    if (!fullName) errors.push("Full name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (!className) errors.push("Class name is required");
    if (!studentCode) errors.push("Student code is required");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingStudentCode = await User.findOne({ studentCode });
    if (existingStudentCode) {
      return res.status(400).json({ message: "Student code already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      className,
      studentCode
    });

    return res.status(201).json({
  message: "Student created successfully",
  student: {
    id: student._id,
    fullName: student.fullName,
    email: student.email,
    role: student.role,
    className: student.className,
    studentCode: student.studentCode
  }
});
  } catch (error) {
    console.error("Create student error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    return res.status(200).json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    return res.status(200).json(students);
  } catch (error) {
    console.error("Get students error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher"
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json(teacher);
  } catch (error) {
    console.error("Get teacher by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Get student by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { fullName, email, subject, className, teacherCode } = req.body;

    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher"
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (email && email.toLowerCase() !== teacher.email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      teacher.email = email.toLowerCase();
    }

    if (teacherCode && teacherCode !== teacher.teacherCode) {
      const existingTeacherCode = await User.findOne({ teacherCode });
      if (existingTeacherCode) {
        return res.status(400).json({ message: "Teacher code already exists" });
      }
      teacher.teacherCode = teacherCode;
    }

    if (fullName) teacher.fullName = fullName;
    if (subject) teacher.subject = subject;
    if (className) teacher.className = className;

    await teacher.save();

    return res.status(201).json({
  message: "Teacher created successfully",
  teacher: {
    id: teacher._id,
    fullName: teacher.fullName,
    email: teacher.email,
    role: teacher.role,
    subject: teacher.subject,
    className: teacher.className,
    teacherCode: teacher.teacherCode
  }
});
  } catch (error) {
    console.error("Update teacher error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { fullName, email, className, studentCode } = req.body;

    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email.toLowerCase() !== student.email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      student.email = email.toLowerCase();
    }

    if (studentCode && studentCode !== student.studentCode) {
      const existingStudentCode = await User.findOne({ studentCode });
      if (existingStudentCode) {
        return res.status(400).json({ message: "Student code already exists" });
      }
      student.studentCode = studentCode;
    }

    if (fullName) student.fullName = fullName;
    if (className) student.className = className;

    await student.save();

    return res.status(201).json({
  message: "Student created successfully",
  student: {
    id: student._id,
    fullName: student.fullName,
    email: student.email,
    role: student.role,
    className: student.className,
    studentCode: student.studentCode
  }
});
  } catch (error) {
    console.error("Update student error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findOneAndDelete({
      _id: req.params.id,
      role: "teacher"
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};