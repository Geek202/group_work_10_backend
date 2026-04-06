const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["director", "teacher", "student"],
      required: true
    },
    subject: {
      type: String,
      trim: true,
      default: ""
    },
    className: {
      type: String,
      trim: true,
      default: ""
    },
    studentCode: {
      type: String,
      trim: true,
      sparse: true
    },
    teacherCode: {
      type: String,
      trim: true,
      sparse: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);