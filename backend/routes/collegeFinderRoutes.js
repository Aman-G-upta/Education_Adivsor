const express = require("express");
const { findColleges } = require("../controllers/collegeFinderController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, findColleges);

module.exports = router;