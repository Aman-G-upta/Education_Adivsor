const StudentProfile = require("../models/StudentProfile");
const pathways = require("../data/pathways");
const careers = require("../data/careers");
const { computeMatches, buildStudentVector } = require("../utils/recommendationEngine");

// GET /api/recommendation/results
const getResults = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        message: "Please complete onboarding before viewing recommendations",
      });
    }

    if (profile.onboardingStep < 6) {
      return res.status(400).json({
        message: "Onboarding is not complete yet",
        onboardingStep: profile.onboardingStep,
      });
    }

    const studentVec = buildStudentVector(profile);

    // This is the key branch: Class 10 gets PATHWAYS (Science/Commerce/
    // etc.), Class 12 gets CAREERS (Software Engineer/Doctor/etc.) - same
    // engine, different dataset, because the decision each student faces
    // is genuinely different at each stage.
    const dataset = profile.educationLevel === "class10" ? pathways : careers;
    const matches = computeMatches(studentVec, dataset, 5);

    res.status(200).json({
      message: "Recommendations generated",
      educationLevel: profile.educationLevel,
      matches,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===== ADD THIS to your existing recommendationController.js =====
// (keep your existing getResults function - just add this new one
// alongside it, and add it to the module.exports at the bottom)


// GET /api/recommendation/dataset
// Returns the reference dataset (pathways or careers, with their
// required-skill profiles) for the student's own education level. This
// is what the What-If Simulator runs its live recalculation against, so
// it doesn't need to call the backend on every slider move.
const getDataset = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId });

    if (!profile || !profile.educationLevel) {
      return res.status(404).json({ message: "Please complete onboarding first" });
    }

    const dataset = profile.educationLevel === "class10" ? pathways : careers;

    res.status(200).json({
      educationLevel: profile.educationLevel,
      dataset,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remember to add getDataset here alongside your existing exports:
// module.exports = { getResults, getDataset };

module.exports = { getResults,getDataset };