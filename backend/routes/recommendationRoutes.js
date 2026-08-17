const express = require("express");
const { getResults,getDataset } = require("../controllers/recommendationController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/results", protect, getResults);
router.get("/dataset", protect, getDataset);

module.exports = router;