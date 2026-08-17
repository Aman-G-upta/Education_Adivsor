const StudentProfile = require("../models/StudentProfile");

// GET /api/onboarding/me
// Called on page load. Tells the frontend: is there a saved profile at
// all, and if so, which step did the student last complete?
const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId });
    res.status(200).json(profile || { onboardingStep: 0 });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// POST /api/onboarding/education-level
// Body: { educationLevel: "class10" | "class12", stream?: "science" }
const saveEducationLevel = async (req, res) => {
  try {
    const { educationLevel, stream } = req.body;

    if (!["class10", "class12"].includes(educationLevel)) {
      return res.status(400).json({ message: "Invalid education level" });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { educationLevel, stream, onboardingStep: 1 },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Education level saved", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/onboarding/basic-profile
const saveBasicProfile = async (req, res) => {
  try {
    const { fullName, age, state, district, preferredLanguage } = req.body;

    if (!fullName || !age || !state) {
      return res.status(400).json({ message: "Name, age, and state are required" });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { fullName, age, state, district, preferredLanguage, onboardingStep: 2 },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Basic profile saved", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/onboarding/academic
// Body: { scores: { Mathematics: 85, "Computer Science": 91, ... } }
// Accepts ANY subject names as keys - this is what makes custom subjects
// work. The frontend can send the fixed list plus any extra subjects the
// student typed in themselves, and this endpoint doesn't care either way.
const saveAcademic = async (req, res) => {
  try {
    const { scores } = req.body;

    if (!scores || typeof scores !== "object" || Object.keys(scores).length === 0) {
      return res.status(400).json({ message: "Academic scores are required" });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { academicScores: scores, onboardingStep: 3 },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Academic scores saved", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/onboarding/aptitude
const saveAptitude = async (req, res) => {
  try {
    const { logical, numerical, analytical, problemSolving, verbal, spatial } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      {
        aptitudeScores: { logical, numerical, analytical, problemSolving, verbal, spatial },
        onboardingStep: 4,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Aptitude scores saved", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/onboarding/interest
const saveInterest = async (req, res) => {
  try {
    const interests = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { interests, onboardingStep: 5 },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Interests saved", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/onboarding/preferences
const savePreferences = async (req, res) => {
  try {
    const preferences = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { preferences, onboardingStep: 6 }, // 6 = fully complete
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Onboarding complete", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMyProfile,
  saveEducationLevel,
  saveBasicProfile,
  saveAcademic,
  saveAptitude,
  saveInterest,
  savePreferences,
};