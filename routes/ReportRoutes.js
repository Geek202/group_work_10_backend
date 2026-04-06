const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/ReportController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/report/:studentId", verifyToken, generateReport);

module.exports = router;