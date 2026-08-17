const express = require("express");
const { getCareerRoadmap, getPathwayRoadmap } = require("../controllers/roadmapController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/career/:id", protect, getCareerRoadmap);
router.get("/pathway/:id", protect, getPathwayRoadmap);

module.exports = router;