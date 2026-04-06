const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/AuthRoutes");
const teacherRoutes = require("./routes/TeacherRoutes");
const directorRoutes = require("./routes/DirectorRoutes");
const reportRoutes = require("./routes/ReportRoutes");
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("School Management API Running");
});

app.use("/auth", authRoutes);
app.use("/teacher", teacherRoutes);
app.use("/director", directorRoutes);
app.use("/student", reportRoutes);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});