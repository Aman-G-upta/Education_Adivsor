const express = require("express");
const {
  getMyProfile,
  saveEducationLevel,
  saveBasicProfile,
  saveAcademic,
  saveAptitude,
  saveInterest,
  savePreferences,
} = require("../controllers/onboardingController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.post("/education-level", protect, saveEducationLevel);
router.post("/basic-profile", protect, saveBasicProfile);
router.post("/academic", protect, saveAcademic);
router.post("/aptitude", protect, saveAptitude);
router.post("/interest", protect, saveInterest);
router.post("/preferences", protect, savePreferences);

module.exports = router;