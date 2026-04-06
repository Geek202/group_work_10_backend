    const mongoose = require("mongoose");

const MarkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    className: {
      type: String,
      required: true
    },
    term: {
      type: String,
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);


MarkSchema.index(
  { student: 1, subject: 1, term: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("Mark", MarkSchema);