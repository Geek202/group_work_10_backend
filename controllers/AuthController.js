const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = [];
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   return res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    subject: user.subject,
    className: user.className,
    teacherCode: user.teacherCode,
    studentCode: user.studentCode
  }
});
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};